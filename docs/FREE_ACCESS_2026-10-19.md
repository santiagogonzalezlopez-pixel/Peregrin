# Peregrin is fully free

The owner changed the product decision on 2026-10-19: all features are free.
This supersedes the earlier EUR 1 price change and historical Premium instructions.

## Implementation

- Every country, route guide, private journal and earned certificate is available
  without a purchase, subscription or support code, in all five languages.
- Existing profiles, visits and journals are preserved. Certificates still require
  the relevant visits, and journal entries remain private to their owner.
- Removed the web checkout paths, payment verification calls, Android Billing
  plugin and Billing dependency. Historical payment Functions and receipts are
  retained; the free app does not call them.
- Fixed the first suggested step, which linked to a nonexistent screen.
- Updated the privacy notice and offline cache to version 49.
- Android release: versionCode 70, versionName 1.0.69.

## Verification

- Nine app tests cover free access across 69 countries, five-language copy,
  private-note save/load, earned certificates, account-data preservation, the
  first-step navigation, removed checkout paths and consistent packaged assets.
- The Auth/Firestore emulator test passed: an unpaid owner can create, read and
  delete their journal; another user and anonymous readers cannot access it;
  invalid data is rejected.
- Android release compilation and signing passed. The final archive and live
  deployments must be verified after the navigation correction.

## Publication record

- Free journal rules deployed successfully to `peregrin-d7611`.
- Google Play purchase option `premium-all` is inactive.
- All three Stripe Payment Links are inactive.
- The pending paid Android release 69 was discarded before review.
- Cloud billing was not upgraded. Free access no longer depends on payment
  verification Functions. This does not establish that unrelated server email
  notifications work while the project's billing is disabled.

The remaining publication evidence is recorded below as rollout completes.
