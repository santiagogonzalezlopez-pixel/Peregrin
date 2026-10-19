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
- Android release compilation and signing passed. The final AAB's seven changed
  web files match `www`, and its manifest contains no Billing permission.
- Browser smoke checks with an unpaid local fixture passed: first-step navigation,
  Japan map and sanctuary details, a complete route guide, private-note saving and
  the free profile badge. No console errors were observed. This fixture did not
  write test data into a real user's production account.

## Publication record

- Free journal rules deployed successfully to `peregrin-d7611`.
- Google Play purchase option `premium-all` is inactive.
- All three Stripe Payment Links are inactive.
- The pending paid Android release 69 was discarded before review.
- Cloud billing was not upgraded. Free access no longer depends on payment
  verification Functions. This does not establish that unrelated server email
  notifications work while the project's billing is disabled.

## Final publication evidence

- Netlify, Firebase Hosting and GitHub Pages return HTTP 200 with free access,
  no checkout link, the corrected first-step navigation and offline cache 49.
- Google Play release 70 (1.0.69), the default listing description and the custom
  Philippines description were submitted together. The Console shows **Changes
  in review**, with automatic pre-review checks still running. Managed publishing
  is disabled; the release targets 100% of the existing country distribution.
- The only bundle warning concerns a missing deobfuscation file; this build does
  not enable minification. No supported devices were lost.
- AAB SHA-256:
  `93D1E4ECC254D895F07AD74ECFCC432C10F86525E8E6717643136EFBBBF25A50`.
- The Stripe Premium product is archived. The newly created payment webhook
  destination is disabled. All three Payment Links remain inactive.

## Remaining legacy copy

The old EUR 2.99 and EUR 4.99 inactive Stripe links retain the earlier EUR 1
forwarding notice. Their target link displays the new completely-free message
and points to the free Netlify app; none of these links accepts a payment.
The Dashboard does not expose editing for those inactive-link messages. Do not
reactivate purchases to change this text. Updating `inactive_message` through an
authorized Stripe API connection would finish this remaining copy cleanup.

Existing Android installations need the new version after Google approves it;
they can use the free web app in the meantime. Approval and an on-device Android
smoke test have not been completed by this publication run.
