# Google Play Billing and Stripe setup

Last updated: 2026-10-19

Peregrin uses Google Play Billing inside the Android app and Stripe for the web.

## Google Play product

- Type: one-time product / in-app product
- Product ID: `peregrin_premium_all`
- Suggested name: `Peregrin Premium`
- Intended buyer-facing price: `EUR 1.00`, paid once for permanent full access.
- On 2026-10-19, the active `premium-all` purchase option was repriced using
  EUR 1.00 as the conversion base for all territories and new territories.
  All 33 territories billed in EUR were then individually set to a final
  `1.00 EUR`; Play Console confirmed the changes were saved.
- The bulk pricing tool adds tax and applies rounding. Entering `1.00 EUR`
  there produced `1.19 EUR` in Spain. Use the individual price-cell editor
  to set the exact final `1.00 EUR` and verify every EUR row before saving.
- Android reads the localized price from Google Play using `getPremiumPrice`.
  If the lookup fails, it shows the checkout button without an invented amount;
  the official purchase sheet still supplies the final price.
- Web price labels derive from `PREMIUM_PRICE_EUR` in `index.html`, formatted
  for English, Spanish, French, Italian and Portuguese. Provider prices must
  still be updated separately before publishing a new advertised price.
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
- The Function acknowledges the non-consumable purchase, preserving restoration.
- Automatic restore on login, the Android restore button and the
  `purchaseUpdated` listener all use server verification. A returned token alone
  does not unlock Premium when verification fails.

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
https://buy.stripe.com/00w8wR9glaZB2pt31yfEk02
```

- The app appends checkout context such as `client_reference_id`,
  `prefilled_email`, and `locale`.
- The active link charges exactly EUR 1.00 once. Its live checkout order summary
  was verified on 2026-10-19 (`currency: eur`, `totalAmount: 100`). Both older
  links were deactivated and their prices archived; EUR 1.00 is the default.
- When Stripe returns with `payment=success`, the app checks the recent checkout
  context for the same user and refreshes their server-owned Premium state.
  The return URL alone does not unlock Premium.

## Service availability checked on 2026-10-19

Google Cloud reports that the billing account's free trial has expired. The
deployed webhook logs state that requests fail because billing is disabled for
the project. Reactivate billing before claiming that purchase activation works.
Then verify the Stripe webhook configuration and both purchase verification
endpoints. A changed price is not evidence of a successful Premium activation.

Stripe initially had no event destinations configured. The live destination
`we_1USKaARtrJ0ahZ4DGyN6GjC0` was created for
`https://us-central1-peregrin-d7611.cloudfunctions.net/stripeWebhook`, subscribing
only to `checkout.session.completed` and
`checkout.session.async_payment_succeeded` (snapshot payloads). Its signing
secret still needs to be configured securely as `STRIPE_WEBHOOK_SECRET` on the
server after billing is restored. Do not copy secret values into this repository.

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

The server validates support codes. Use the first one as the support code for
paid users who are blocked. Codes do not bypass an unavailable verification
server, and the client cannot grant itself Premium through Firestore.

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
directly. Google Play unlocks and support-code validation must come from the server.

The app does not store the full purchase token in `users`; it stores a server-side
hash. The full token is used only inside the Cloud Function to query Google Play.
