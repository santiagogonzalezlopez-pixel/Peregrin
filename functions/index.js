"use strict";

const crypto = require("crypto");
const {google} = require("googleapis");
const admin = require("firebase-admin");
const logger = require("firebase-functions/logger");
const {onCall, HttpsError} = require("firebase-functions/v2/https");

admin.initializeApp();

const PACKAGE_NAME = "com.peregrin.app";
const PREMIUM_PRODUCT_ID = "peregrin_premium_all";
const REGION = "europe-west1";
const ANDROID_PUBLISHER_SCOPE = "https://www.googleapis.com/auth/androidpublisher";

function asTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
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

async function acknowledgeIfNeeded(androidPublisher, purchase) {
  if (purchase.acknowledgementState === 1) return true;

  try {
    await androidPublisher.purchases.products.acknowledge({
      packageName: PACKAGE_NAME,
      productId: PREMIUM_PRODUCT_ID,
      token: purchase.purchaseToken,
      requestBody: {},
    });
    return true;
  } catch (error) {
    logger.error("google_play_purchase_acknowledge_failed", {
      code: error.code,
      message: error.message,
      errors: error.errors,
    });
    throw new HttpsError(
      "failed-precondition",
      "Google Play purchase was verified but could not be acknowledged."
    );
  }
}

exports.verifyGooglePlayPurchase = onCall(
  {
    region: REGION,
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
    await acknowledgeIfNeeded(androidPublisher, purchase);

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
          acknowledgementState: 1,
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

    return {
      success: true,
      productId: PREMIUM_PRODUCT_ID,
      orderId,
      purchaseTime,
    };
  }
);
