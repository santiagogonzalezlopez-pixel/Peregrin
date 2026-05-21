# Peregrin Passport operations

Last updated: 2026-05-21

This is the operating map for Peregrin Passport. Read this before making changes,
especially in a new Codex conversation.

## Product and surfaces

- Product name: `Peregrin Passport`
- Android package: `com.peregrin.app`
- Firebase project: `peregrin-d7611`
- GitHub repo: `https://github.com/santiagogonzalezlopez-pixel/Peregrin.git`
- GitHub Pages: `https://santiagogonzalezlopez-pixel.github.io/Peregrin/`
- Web root file: `index.html`
- Capacitor web directory: `www`
- Android packaged web assets: `android/app/src/main/assets/public`
- Current Android version after the payment recovery work: `versionCode 31`, `versionName 1.0.30`

The web app is mostly a static app. Android is the same web app packaged through
Capacitor, plus native Google Play Billing code.

## Files that matter most

- `index.html`: primary app code for web and Android before Capacitor copy.
- `www/index.html`: web assets used by Capacitor.
- `android/app/src/main/java/com/peregrin/app/PeregrinBillingPlugin.java`: native Google Play Billing bridge.
- `android/app/build.gradle`: Android package version and Billing dependency.
- `firestore.rules`: client-side Firestore permissions, including Premium code unlock rules.
- `functions/index.js`: Firebase Functions for Google Play verification and Stripe webhook code.
- `docs/PLAY_BILLING_SETUP.md`: payment-specific setup notes.
- `docs/RELEASE_CHECKLIST.md`: mandatory release checklist.
- `docs/PAYMENT_INCIDENT_RUNBOOK.md`: what to do when a paid user is blocked.

## Premium source of truth

Premium means the user document in Firestore has:

```text
isPremium: true
unlockedRegions: ["all"]
```

The app already knows how to unlock Premium once Firestore accepts that state.
The fragile part is making sure a real payment reaches that state.

Active emergency Premium codes:

```text
PEREGRIN-388066-6291
PEREGRIN-PREMIUM-2026
```

The primary emergency code to give a blocked paid user is:

```text
PEREGRIN-388066-6291
```

Do not remove these codes while the app is live unless there is a deliberate
migration plan and a new support path.

## Payment flows

Android:

- Product ID: `peregrin_premium_all`
- Payment provider: Google Play Billing.
- Native plugin: `PeregrinBilling`.
- Server verification function: `verifyGooglePlayPurchase`.
- Deployed function location: `europe-west1`.
- The web client calls Firebase Functions in `europe-west1`.
- Version `1.0.30` also has restore purchase and an emergency unlock fallback when
  Google Play returns a paid purchase token but server verification fails.

Web:

- Payment provider: Stripe Payment Link.
- Payment link: `https://buy.stripe.com/bJeeVfbotaZBaVZgSofEk01`
- If the user returns from Stripe with a recent local checkout session and
  `payment=success`, the app unlocks Premium through the emergency code internally.
- The user does not normally need to type the code in this happy path.

Stripe webhook:

- Existing deployed `stripeWebhook` location seen on 2026-05-21: `us-central1`.
- This repo contains webhook code, but live webhook behavior must be verified before
  relying on automatic email or server-side Stripe unlocks.
- Do not promise that email delivery is active unless `SMTP_URL`, `SMTP_FROM`,
  live Stripe secrets, webhook endpoint, and live Stripe events have all been verified.

## Firebase Functions regions

These regions must stay aligned with production and with the frontend:

```text
verifyGooglePlayPurchase -> europe-west1
stripeWebhook            -> us-central1
createCheckoutSession    -> us-central1
```

Do not deploy all functions casually. Stripe functions have existed outside this
repo/history, and secrets/runtime settings must be checked before replacing them.

Safer targeted commands:

```powershell
npx.cmd firebase functions:list --project peregrin-d7611
npx.cmd firebase functions:log --only verifyGooglePlayPurchase --project peregrin-d7611 -n 100
npx.cmd firebase deploy --only firestore:rules --project peregrin-d7611
```

Only deploy a Function after confirming its region, environment variables, secrets,
runtime, and source match the intended production behavior.

## Release discipline

Peregrin is live, so work in small changes:

- One user-visible goal per release.
- No "while we are here" changes in payment or release work.
- Keep commits small and named after the actual change.
- Check `git status --short --branch` before and after work.
- Run the release checklist before uploading any AAB.
- Do not treat "should work" as enough for payment flows. Look for evidence.

For Android releases, always run:

```powershell
npm.cmd run cap:copy
npm.cmd run android:bundle:release
```

The release AAB is generated here:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

## Dangerous zones

Be extra careful with:

- `functions/index.js`
- `firestore.rules`
- `index.html` payment constants and Premium unlock code
- `www/index.html`
- `android/app/build.gradle`
- `PeregrinBillingPlugin.java`
- Play Console product and tester settings
- Stripe live/test mode configuration

Do not expose API keys, Stripe secrets, webhook secrets, SMTP credentials, keystore
passwords, or service account credentials in chat, commits, docs, screenshots, or logs.

## OneDrive and machine searches

Do not run broad searches over `C:\Users\Admin` or OneDrive. Keep searches inside:

```text
C:\Users\Admin\peregrin-app
```

Broad recursive searches can cause OneDrive to hydrate large cloud-only files.

## Suggested prompt for a new Codex conversation

Paste this at the start of a new conversation inside the project:

```text
Estamos en el proyecto Peregrin Passport en C:\Users\Admin\peregrin-app.
Lee primero README.md, docs/APP_OPERATIONS.md, docs/RELEASE_CHECKLIST.md,
docs/PAYMENT_INCIDENT_RUNBOOK.md y docs/PLAY_BILLING_SETUP.md.
Antes de tocar pagos, Premium, Firebase Functions, Firestore rules, Play Billing,
Stripe, versionCode/versionName o despliegues, revisa el estado git y usa el
checklist. Cambios pequenos, una cosa cada vez. No busques fuera del repo salvo
que Santiago lo pida explicitamente.
```

That prompt matters because the durable context should live in the repo, not only
in one long chat.

