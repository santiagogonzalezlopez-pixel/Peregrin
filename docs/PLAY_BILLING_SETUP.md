# Google Play Billing and Stripe setup

Last updated: 2026-05-21

Peregrin uses Google Play Billing inside the Android app and Stripe for the web.

## Google Play product

- Type: one-time product / in-app product
- Product ID: `peregrin_premium_all`
- Suggested name: `Peregrin Premium`
- Intended buyer-facing price: `EUR 2.99`
- Play Console price must be checked in the purchase sheet before release. If
  Play adds Spanish VAT on top of the configured amount, do not leave the base
  price at `EUR 2.99` while the app says `2.99`. Either use a tax-inclusive
  pricing/template option for EU countries, or set the Spain base price to about
  `EUR 2.47` so `2.47 + 21% VAT` rounds to `2.99`.
- Benefit: permanent unlock for all countries, Premium guides, private journal,
  certificates, routes, and achievements

Before sending an AAB to review, confirm in Play Console that the product exists,
is active, and has a price configured.

## Android activation in code

Android checkout is enabled in `index.html`:

```js
const GOOGLE_PLAY_CHECKOUT_ENABLED = true;
const GOOGLE_PLAY_PRODUCT_ID = 'peregrin_premium_all';
```

The native bridge lives in:

```text
android/app/src/main/java/com/peregrin/app/PeregrinBillingPlugin.java
```

## Android flow

- Android calls the native `PeregrinBilling` plugin.
- Google Play opens the official purchase sheet.
- The app receives a purchase token from Google Play.
- The app sends the token to Firebase Function `verifyGooglePlayPurchase`.
- The Function validates the token with Google Play Developer API.
- If Google confirms the purchase, Firebase marks the user Premium from the server.
- The Function consumes the one-time product so the same Google Play account can buy
  again for another Peregrin profile.
- Version `1.0.30` adds:
  - automatic restore on login when the user is not Premium,
  - a visible "Restaurar compra" button in Android,
  - a `purchaseUpdated` listener,
  - emergency code unlock if Google Play returns a paid token but server
    verification fails.

## Firebase / Google Play API

- Firebase project: `peregrin-d7611`
- Callable Function: `verifyGooglePlayPurchase`
- Deployed callable region: `europe-west1`
- Android package: `com.peregrin.app`
- Product: `peregrin_premium_all`

The frontend calls:

```js
firebase.app().functions('europe-west1')
```

So `verifyGooglePlayPurchase` must remain in `europe-west1`.

Service account seen in Play Console on 2026-05-21:

```text
844223897807-compute@developer.gserviceaccount.com
```

On 2026-05-21, Play Console visually showed this service account as active and
with administrator permissions for `Peregrin Passport / com.peregrin.app`.

If Google Play verification fails with `403`, check:

- Play Console -> Setup -> API access.
- The linked Google Cloud project.
- Service account permissions for this specific app.
- Google Play Developer API access.
- Whether permissions have had enough time to propagate.

## Web Stripe flow

- Stripe Payment Link:

```text
https://buy.stripe.com/bJeeVfbotaZBaVZgSofEk01
```

- The app appends checkout context such as `client_reference_id`,
  `prefilled_email`, and `locale`.
- When Stripe returns to the app with `payment=success` and the local checkout
  session is recent, the app unlocks Premium internally using the primary emergency
  code.

This fallback is intentional. It protects paid users from being blocked if the
server-side Stripe webhook cannot match the payment to the Firebase user.

## Stripe webhook status

Existing deployed functions seen on 2026-05-21:

```text
verifyGooglePlayPurchase  europe-west1
createCheckoutSession     us-central1
stripeWebhook             us-central1
```

This repo contains `stripeWebhook` code intended to:

- verify `checkout.session.completed`,
- verify `checkout.session.async_payment_succeeded`,
- mark the matched Firebase user Premium,
- store paid sessions that need manual linking,
- optionally email the Premium code if SMTP is configured.

Important: do not promise automatic email delivery until live Stripe webhook
configuration and SMTP variables have been verified in production.

Required environment for email-enabled Stripe webhook:

```text
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SECRET_KEY=sk_live_...
PREMIUM_FALLBACK_CODES=PEREGRIN-388066-6291,PEREGRIN-PREMIUM-2026
SMTP_URL=smtp://usuario:password@host:puerto
SMTP_FROM="Peregrin" <elnuevoeuropeo@gmail.com>
```

Never commit real secret values.

## Emergency Premium codes

Active codes:

```text
PEREGRIN-388066-6291
PEREGRIN-PREMIUM-2026
```

The app accepts both. Firestore rules accept both. Use the first one as the support
code for paid users who are blocked.

The user normally does not see the emergency code in the Android paid flow. Version
`1.0.30` applies it internally only after Google Play has returned a paid purchase
token and server verification did not complete.

## Deploy commands

Safe rules deploy:

```powershell
npx.cmd firebase deploy --only firestore:rules --project peregrin-d7611
```

Inspect deployed functions:

```powershell
npx.cmd firebase functions:list --project peregrin-d7611
```

Check Google Play verification logs:

```powershell
npx.cmd firebase functions:log --only verifyGooglePlayPurchase --project peregrin-d7611 -n 100
```

Function deploys should be targeted and deliberate. Do not deploy all Functions
unless the Stripe functions, regions, runtime, and live environment variables have
all been checked.

## Security notes

Firestore rules no longer allow a client to claim `premiumSource: google_play`
directly. Google Play unlocks must come from the server. Client-side Premium code
unlock remains available as a support fallback.

The app does not store the full purchase token in `users`; it stores a server-side
hash. The full token is used only inside the Cloud Function to query Google Play.
