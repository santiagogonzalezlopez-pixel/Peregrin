# Peregrin Passport

## Current policy: fully free since 2026-10-19

Peregrin is fully free. All countries, routes, complete guides, private journals and earned certificates are available without purchases, codes or subscriptions. Android versionCode 70 / versionName 1.0.69 removes Google Play Billing. Existing accounts and visits are preserved. See `docs/FREE_ACCESS_2026-10-19.md` for verification and publication status.

The payment instructions below are historical reference for older versions and receipts. They do not authorize reactivating sales or restoring paywalls. Direct users of older versions to update the app or use the current web app. Cloud billing has not been upgraded.


Peregrin Passport is a static web app plus a Capacitor Android app.

Before changing production behavior, read these docs in this order:

1. `docs/APP_OPERATIONS.md`
2. `docs/RELEASE_CHECKLIST.md`
3. `docs/PAYMENT_INCIDENT_RUNBOOK.md`
4. `docs/PLAY_BILLING_SETUP.md`

Current production-critical rule: do not touch Premium, payments, Firebase Functions,
Firestore rules, Play Billing, Stripe, or release versioning without using the release
checklist and verifying the exact deployed surface.

