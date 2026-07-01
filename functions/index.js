"use strict";

const crypto = require("crypto");
const {google} = require("googleapis");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {onCall, onRequest, HttpsError} = require("firebase-functions/v2/https");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");

admin.initializeApp();

const PACKAGE_NAME = "com.peregrin.app";
const PREMIUM_PRODUCT_ID = "peregrin_premium_all";
const GOOGLE_PLAY_FUNCTION_REGION = "europe-west1";
const STRIPE_FUNCTION_REGION = "us-central1";
const COMMENT_FUNCTION_REGION = "europe-west1";
const ANDROID_PUBLISHER_SCOPE = "https://www.googleapis.com/auth/androidpublisher";
const STRIPE_API_VERSION = "2026-02-25.clover";
const DEFAULT_PREMIUM_FALLBACK_CODES = [
  "PEREGRIN-388066-6291",
  "PEREGRIN-PREMIUM-2026",
];
const PREMIUM_FALLBACK_CODES = (process.env.PREMIUM_FALLBACK_CODES || process.env.PREMIUM_FALLBACK_CODE || "")
  .split(",")
  .map((code) => code.trim().toUpperCase())
  .filter(Boolean);
const ACTIVE_PREMIUM_FALLBACK_CODES = PREMIUM_FALLBACK_CODES.length
  ? PREMIUM_FALLBACK_CODES
  : DEFAULT_PREMIUM_FALLBACK_CODES;
const PRIMARY_PREMIUM_FALLBACK_CODE = ACTIVE_PREMIUM_FALLBACK_CODES[0];
const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "elnuevoeuropeo@gmail.com";
const COMMENT_NOTIFY_EMAIL = process.env.COMMENT_NOTIFY_EMAIL || SUPPORT_EMAIL;
const SMTP_FROM = process.env.SMTP_FROM || `"Peregrin" <${SUPPORT_EMAIL}>`;
const FIREBASE_CONSOLE_PROJECT_URL = "https://console.firebase.google.com/project/peregrin-d7611";

function asTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value) {
  return asTrimmedString(value).toLowerCase();
}

function truncateForEmail(value, maxLength) {
  const text = asTrimmedString(value).replace(/\s+/g, " ");
  if (text.length <= maxLength) return text;
  return text.slice(0, Math.max(0, maxLength - 3)).trimEnd() + "...";
}

function getSmtpTransporter() {
  if (!process.env.SMTP_URL) return null;
  return nodemailer.createTransport(process.env.SMTP_URL);
}

function getIsoDateFromData(data) {
  const createdAtIso = asTrimmedString(data && data.createdAtIso);
  if (createdAtIso) return createdAtIso;

  const createdAtMs = Number(data && data.createdAtMs);
  if (Number.isFinite(createdAtMs) && createdAtMs > 0) {
    return new Date(createdAtMs).toISOString();
  }

  return new Date().toISOString();
}

function getFirestoreConsoleUrl(pathSegments) {
  const encodedPath = pathSegments
    .map((segment) => `~2F${encodeURIComponent(String(segment))}`)
    .join("");
  return `${FIREBASE_CONSOLE_PROJECT_URL}/firestore/databases/-default-/data/${encodedPath}`;
}

function getStripeClient() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
    apiVersion: STRIPE_API_VERSION,
  });
}

function tokenHash(token) {
  return crypto.createHash("sha256").update(token, "utf8").digest("hex");
}

function isValidSource(source) {
  return source === "google_play" || source === "google_play_restore";
}

function getPublicSource(source) {
  return isValidSource(source) ? source : "google_play";
}

function isValidClientReferenceId(value) {
  return /^[A-Za-z0-9_-]{1,200}$/.test(value);
}

function stripeSessionEmail(session) {
  return normalizeEmail(
    session && session.customer_details && session.customer_details.email
      ? session.customer_details.email
      : session && session.customer_email
  );
}

function stripeSessionUid(session) {
  const reference = asTrimmedString(
    (session && session.client_reference_id) ||
    (session && session.metadata && session.metadata.uid)
  );
  return isValidClientReferenceId(reference) ? reference : "";
}

async function ensurePremiumFallbackCode(db) {
  await Promise.all(
    ACTIVE_PREMIUM_FALLBACK_CODES.map((code) =>
      db.collection("premiumCodes").doc(code).set(
        {
          active: true,
          source: "emergency_payment_fallback",
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true}
      )
    )
  );
}

async function findStripeUser(session) {
  const uid = stripeSessionUid(session);
  if (uid) {
    return {uid, matchedBy: "client_reference_id"};
  }

  const email = stripeSessionEmail(session);
  if (!email) return {uid: "", matchedBy: ""};

  try {
    const user = await admin.auth().getUserByEmail(email);
    return {uid: user.uid, matchedBy: "customer_email"};
  } catch (error) {
    logger.warn("stripe_customer_email_not_found_in_firebase_auth", {
      email,
      code: error.code,
    });
    return {uid: "", matchedBy: ""};
  }
}

async function grantStripePremium(db, session, uid, matchedBy) {
  const now = admin.firestore.FieldValue.serverTimestamp();
  const nowIso = new Date().toISOString();
  const sessionRef = db.collection("stripeCheckoutSessions").doc(session.id);
  const userRef = db.collection("users").doc(uid);
  const email = stripeSessionEmail(session);

  await db.runTransaction(async (transaction) => {
    const existingSession = await transaction.get(sessionRef);
    if (
      existingSession.exists &&
      existingSession.data().uid &&
      existingSession.data().uid !== uid
    ) {
      throw new Error("stripe_session_already_linked_to_another_user");
    }

    transaction.set(
      sessionRef,
      {
        uid,
        matchedBy,
        productId: PREMIUM_PRODUCT_ID,
        customerEmail: email,
        customerId: asTrimmedString(session.customer),
        paymentIntentId: asTrimmedString(session.payment_intent),
        paymentLinkId: asTrimmedString(session.payment_link),
        amountTotal: session.amount_total || null,
        currency: asTrimmedString(session.currency),
        paymentStatus: asTrimmedString(session.payment_status),
        mode: asTrimmedString(session.mode),
        processedAt: now,
      },
      {merge: true}
    );

    transaction.set(
      userRef,
      {
        isPremium: true,
        unlockedRegions: ["all"],
        premiumSource: "stripe",
        premiumUnlockedAt: nowIso,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId: asTrimmedString(session.payment_intent),
        stripeCustomerId: asTrimmedString(session.customer),
        stripeCustomerEmail: email,
        stripePaymentLinkId: asTrimmedString(session.payment_link),
        stripeVerifiedAt: now,
      },
      {merge: true}
    );
  });
}

async function sendPremiumCodeEmail(email, session) {
  if (!email) return false;
  const transporter = getSmtpTransporter();
  if (!transporter) {
    logger.warn("premium_code_email_not_sent_smtp_missing", {
      email,
      checkoutSessionId: session.id,
    });
    return false;
  }

  await transporter.sendMail({
    from: SMTP_FROM,
    to: email,
    subject: "Peregrin Premium - código de acceso",
    text: [
      "Gracias por tu pago de Peregrin Premium.",
      "",
      "Tu acceso debería activarse automáticamente. Si la app sigue bloqueada, abre Peregrin, pulsa \"Tengo un código Premium\" e introduce:",
      "",
      PRIMARY_PREMIUM_FALLBACK_CODE,
      "",
      "Código alternativo, por si hiciera falta:",
      ACTIVE_PREMIUM_FALLBACK_CODES.find((code) => code !== PRIMARY_PREMIUM_FALLBACK_CODE) || PRIMARY_PREMIUM_FALLBACK_CODE,
      "",
      "Si necesitas ayuda, responde a este correo o escribe a " + SUPPORT_EMAIL + ".",
    ].join("\n"),
  });

  logger.info("premium_code_email_sent", {
    email,
    checkoutSessionId: session.id,
  });
  return true;
}

exports.notifyNewSanctuaryComment = onDocumentCreated(
  {
    region: COMMENT_FUNCTION_REGION,
    document: "sanctuaries/{sanctuaryId}/comments/{commentId}",
    timeoutSeconds: 30,
    memory: "256MiB",
  },
  async (event) => {
    const data = event.data && event.data.data ? event.data.data() : {};
    const sanctuaryId = asTrimmedString(event.params && event.params.sanctuaryId);
    const commentId = asTrimmedString(event.params && event.params.commentId);
    const text = truncateForEmail(data.text, 1200);
    const authorName = truncateForEmail(data.authorName || "Peregrino", 120);
    const authorUid = truncateForEmail(data.authorUid || "", 120);
    const createdAt = getIsoDateFromData(data);
    const consoleUrl = getFirestoreConsoleUrl(["sanctuaries", sanctuaryId, "comments", commentId]);

    if (!text) {
      logger.warn("comment_notification_skipped_empty_text", {
        sanctuaryId,
        commentId,
      });
      return;
    }

    const transporter = getSmtpTransporter();
    if (!transporter) {
      logger.warn("comment_notification_not_sent_smtp_missing", {
        sanctuaryId,
        commentId,
        authorUid,
      });
      return;
    }

    await transporter.sendMail({
      from: SMTP_FROM,
      to: COMMENT_NOTIFY_EMAIL,
      subject: `Nuevo comentario en Peregrin - santuario ${sanctuaryId}`,
      text: [
        "Hay un nuevo comentario en Peregrin.",
        "",
        `Santuario ID: ${sanctuaryId}`,
        `Comentario ID: ${commentId}`,
        `Autor: ${authorName}`,
        authorUid ? `UID: ${authorUid}` : "",
        `Fecha: ${createdAt}`,
        "",
        "Comentario:",
        text,
        "",
        "Puedes revisarlo en Firestore:",
        `sanctuaries/${sanctuaryId}/comments/${commentId}`,
        consoleUrl,
      ].filter(Boolean).join("\n"),
    });

    logger.info("comment_notification_email_sent", {
      sanctuaryId,
      commentId,
      notifyEmail: COMMENT_NOTIFY_EMAIL,
    });
  }
);

exports.notifyReportedSanctuaryComment = onDocumentCreated(
  {
    region: COMMENT_FUNCTION_REGION,
    document: "sanctuaries/{sanctuaryId}/comments/{commentId}/reports/{reporterUid}",
    timeoutSeconds: 30,
    memory: "256MiB",
  },
  async (event) => {
    const report = event.data && event.data.data ? event.data.data() : {};
    const sanctuaryId = asTrimmedString(event.params && event.params.sanctuaryId);
    const commentId = asTrimmedString(event.params && event.params.commentId);
    const reporterUid = asTrimmedString(event.params && event.params.reporterUid);
    const reportCreatedAt = getIsoDateFromData(report);

    const transporter = getSmtpTransporter();
    if (!transporter) {
      logger.warn("comment_report_notification_not_sent_smtp_missing", {
        sanctuaryId,
        commentId,
        reporterUid,
      });
      return;
    }

    const commentRef = admin.firestore()
      .collection("sanctuaries")
      .doc(sanctuaryId)
      .collection("comments")
      .doc(commentId);
    const commentSnap = await commentRef.get();
    const comment = commentSnap.exists ? commentSnap.data() : {};
    const text = truncateForEmail(comment.text, 1200);
    const authorName = truncateForEmail(comment.authorName || "Peregrino", 120);
    const authorUid = truncateForEmail(comment.authorUid || "", 120);
    const commentCreatedAt = commentSnap.exists ? getIsoDateFromData(comment) : "";
    const consoleUrl = getFirestoreConsoleUrl(["sanctuaries", sanctuaryId, "comments", commentId]);

    await transporter.sendMail({
      from: SMTP_FROM,
      to: COMMENT_NOTIFY_EMAIL,
      subject: `Comentario reportado en Peregrin - santuario ${sanctuaryId}`,
      text: [
        "Un usuario ha reportado un comentario en Peregrin.",
        "",
        `Santuario ID: ${sanctuaryId}`,
        `Comentario ID: ${commentId}`,
        `Reportado por UID: ${reporterUid}`,
        `Fecha del reporte: ${reportCreatedAt}`,
        "",
        "Comentario reportado:",
        text || "(El comentario ya no existe o no se ha podido leer.)",
        "",
        `Autor: ${authorName}`,
        authorUid ? `Autor UID: ${authorUid}` : "",
        commentCreatedAt ? `Fecha del comentario: ${commentCreatedAt}` : "",
        "",
        "Para revisarlo o borrarlo, abre Firestore en esta ruta:",
        `sanctuaries/${sanctuaryId}/comments/${commentId}`,
        consoleUrl,
        "",
        "Si decides borrarlo: abre el documento del comentario y usa Delete document.",
      ].filter(Boolean).join("\n"),
    });

    logger.info("comment_report_notification_email_sent", {
      sanctuaryId,
      commentId,
      reporterUid,
      notifyEmail: COMMENT_NOTIFY_EMAIL,
    });
  }
);

async function getAndroidPublisherClient() {
  const auth = new google.auth.GoogleAuth({
    scopes: [ANDROID_PUBLISHER_SCOPE],
  });
  const authClient = await auth.getClient();
  return google.androidpublisher({
    version: "v3",
    auth: authClient,
  });
}

async function verifyProductPurchase(androidPublisher, purchaseToken) {
  try {
    const response = await androidPublisher.purchases.products.get({
      packageName: PACKAGE_NAME,
      productId: PREMIUM_PRODUCT_ID,
      token: purchaseToken,
    });
    return response.data || {};
  } catch (error) {
    logger.error("google_play_purchase_lookup_failed", {
      code: error.code,
      message: error.message,
      errors: error.errors,
    });
    throw new HttpsError(
      "failed-precondition",
      "Google Play purchase verification is not ready. Check Play Console API access."
    );
  }
}

async function consumeIfNeeded(androidPublisher, purchase) {
  if (purchase.consumptionState === 1) return true;

  try {
    await androidPublisher.purchases.products.consume({
      packageName: PACKAGE_NAME,
      productId: PREMIUM_PRODUCT_ID,
      token: purchase.purchaseToken,
    });
    return true;
  } catch (error) {
    logger.error("google_play_purchase_consume_failed", {
      code: error.code,
      message: error.message,
      errors: error.errors,
    });
    return false;
  }
}

exports.verifyGooglePlayPurchase = onCall(
  {
    region: GOOGLE_PLAY_FUNCTION_REGION,
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Sign in before activating Premium.");
    }

    const productId = asTrimmedString(request.data && request.data.productId);
    const purchaseToken = asTrimmedString(request.data && request.data.purchaseToken);
    const source = getPublicSource(asTrimmedString(request.data && request.data.source));

    if (productId && productId !== PREMIUM_PRODUCT_ID) {
      throw new HttpsError("invalid-argument", "Unexpected Google Play product.");
    }
    if (purchaseToken.length < 20 || purchaseToken.length > 4096) {
      throw new HttpsError("invalid-argument", "Missing or invalid Google Play purchase token.");
    }

    const androidPublisher = await getAndroidPublisherClient();
    const purchase = await verifyProductPurchase(androidPublisher, purchaseToken);

    if (purchase.purchaseState !== 0) {
      throw new HttpsError("failed-precondition", "Google Play purchase is not completed.");
    }

    purchase.purchaseToken = purchaseToken;

    const uid = request.auth.uid;
    const now = admin.firestore.FieldValue.serverTimestamp();
    const nowIso = new Date().toISOString();
    const hash = tokenHash(purchaseToken);
    const orderId = asTrimmedString(purchase.orderId) ||
      asTrimmedString(request.data && request.data.orderId);
    const purchaseTime = asTrimmedString(purchase.purchaseTimeMillis) ||
      asTrimmedString(request.data && request.data.purchaseTime);

    const db = admin.firestore();
    const purchaseRef = db.collection("googlePlayPurchases").doc(hash);
    const userRef = db.collection("users").doc(uid);

    await db.runTransaction(async (transaction) => {
      const existingPurchase = await transaction.get(purchaseRef);
      if (existingPurchase.exists && existingPurchase.data().uid !== uid) {
        throw new HttpsError(
          "already-exists",
          "This Google Play purchase is already linked to another Peregrin account."
        );
      }

      transaction.set(
        purchaseRef,
        {
          uid,
          packageName: PACKAGE_NAME,
          productId: PREMIUM_PRODUCT_ID,
          purchaseTokenHash: hash,
          orderId,
          purchaseTime,
          purchaseState: purchase.purchaseState,
          acknowledgementState: purchase.acknowledgementState || 0,
          consumptionState: purchase.consumptionState || 0,
          source,
          verifiedAt: now,
        },
        {merge: true}
      );

      transaction.set(
        userRef,
        {
          isPremium: true,
          unlockedRegions: ["all"],
          premiumSource: source,
          premiumUnlockedAt: nowIso,
          googlePlayProductId: PREMIUM_PRODUCT_ID,
          googlePlayPurchaseTokenHash: hash,
          googlePlayOrderId: orderId,
          googlePlayPurchaseTime: purchaseTime,
          googlePlayVerifiedAt: now,
        },
        {merge: true}
      );
    });

    const consumed = await consumeIfNeeded(androidPublisher, purchase);
    if (consumed) {
      await purchaseRef.set(
        {
          consumptionState: 1,
          consumedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        {merge: true}
      );
    }

    return {
      success: true,
      productId: PREMIUM_PRODUCT_ID,
      orderId,
      purchaseTime,
      consumed,
    };
  }
);

exports.stripeWebhook = onRequest(
  {
    region: STRIPE_FUNCTION_REGION,
    timeoutSeconds: 60,
    memory: "256MiB",
  },
  async (request, response) => {
    if (request.method !== "POST") {
      response.status(405).send("Method not allowed");
      return;
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = request.headers["stripe-signature"];
    if (!webhookSecret || !signature) {
      logger.error("stripe_webhook_not_configured", {
        hasWebhookSecret: !!webhookSecret,
        hasSignature: !!signature,
      });
      response.status(500).send("Stripe webhook is not configured.");
      return;
    }

    let event;
    try {
      event = getStripeClient().webhooks.constructEvent(
        request.rawBody,
        signature,
        webhookSecret
      );
    } catch (error) {
      logger.error("stripe_webhook_signature_failed", {
        message: error.message,
      });
      response.status(400).send("Webhook signature verification failed.");
      return;
    }

    if (
      event.type !== "checkout.session.completed" &&
      event.type !== "checkout.session.async_payment_succeeded"
    ) {
      response.json({received: true, ignored: true});
      return;
    }

    const session = event.data && event.data.object;
    if (!session || !session.id) {
      logger.error("stripe_webhook_missing_session", {eventId: event.id});
      response.status(400).send("Missing checkout session.");
      return;
    }

    if (session.payment_status !== "paid") {
      logger.warn("stripe_checkout_session_not_paid", {
        checkoutSessionId: session.id,
        paymentStatus: session.payment_status,
      });
      response.json({received: true, paid: false});
      return;
    }

    const db = admin.firestore();
    const email = stripeSessionEmail(session);

    try {
      await ensurePremiumFallbackCode(db);

      const userMatch = await findStripeUser(session);
      if (userMatch.uid) {
        await grantStripePremium(db, session, userMatch.uid, userMatch.matchedBy);
      } else {
        await db.collection("stripeCheckoutSessions").doc(session.id).set(
          {
            productId: PREMIUM_PRODUCT_ID,
            customerEmail: email,
            customerId: asTrimmedString(session.customer),
            paymentIntentId: asTrimmedString(session.payment_intent),
            paymentLinkId: asTrimmedString(session.payment_link),
            amountTotal: session.amount_total || null,
            currency: asTrimmedString(session.currency),
            paymentStatus: asTrimmedString(session.payment_status),
            mode: asTrimmedString(session.mode),
            needsManualAccountLink: true,
            processedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          {merge: true}
        );
        logger.warn("stripe_paid_session_without_firebase_user", {
          checkoutSessionId: session.id,
          email,
          clientReferenceId: asTrimmedString(session.client_reference_id),
        });
      }

      await sendPremiumCodeEmail(email, session);
      response.json({received: true, premiumUnlocked: !!userMatch.uid});
    } catch (error) {
      logger.error("stripe_webhook_processing_failed", {
        checkoutSessionId: session.id,
        message: error.message,
        stack: error.stack,
      });
      response.status(500).send("Stripe webhook processing failed.");
    }
  }
);
