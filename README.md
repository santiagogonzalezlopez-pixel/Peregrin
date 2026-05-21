# Peregrin Passport

Peregrin Passport is a static web app plus a Capacitor Android app.

Before changing production behavior, read these docs in this order:

1. `docs/APP_OPERATIONS.md`
2. `docs/RELEASE_CHECKLIST.md`
3. `docs/PAYMENT_INCIDENT_RUNBOOK.md`
4. `docs/PLAY_BILLING_SETUP.md`

Current production-critical rule: do not touch Premium, payments, Firebase Functions,
Firestore rules, Play Billing, Stripe, or release versioning without using the release
checklist and verifying the exact deployed surface.

