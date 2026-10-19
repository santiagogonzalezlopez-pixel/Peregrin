# Peregrin release checklist

Last updated: 2026-10-19

Use this checklist before any production release. Peregrin is fully free since
2026-10-19. Preserve account data, private journal ownership and earned certificates.

## 1. Before changing anything

- Confirm the task is one clear change.
- Read `docs/APP_OPERATIONS.md` and `docs/PLAY_BILLING_SETUP.md`.
- Check the worktree:

```powershell
git status --short --branch
```

- If there are unrelated local changes, do not revert them.
- If payment behavior is involved, inspect deployed functions first:

```powershell
npx.cmd firebase functions:list --project peregrin-d7611
```

## 2. Free-access invariants

- All countries, route guides, private journals and earned certificates are free.
- No purchase, restore, payment link or support-code entry appears in the app.
- Preserve existing accounts, visits and journal data.
- Journal access requires the owner account; never allow access to other users.
- Certificates still require the relevant real visits.
- Keep Google Play purchase options and Stripe Payment Links inactive.
- No payment Function deployment or Cloud billing upgrade is needed for free access.

## 3. Web checks

Before deploying web files:

- Confirm changes are in `index.html`.
- If Capacitor/Android must receive the change, also run `npm.cmd run cap:copy`.
- Run the access and privacy tests:

```powershell
npm.cmd test
npm.cmd run test:rules
rg -n "APP_IS_FREE = true" index.html www/index.html
```

- If deploying GitHub Pages, push to `origin/main` and verify the live page with a
  cache-busting URL.
- If deploying Netlify, verify the live Netlify URL after deploy. Do not assume the
  CLI success message is enough.

## 4. Android AAB build

Before building:

- Increment `versionCode` in `android/app/build.gradle`.
- Update `versionName` if appropriate.
- Run:

```powershell
npm.cmd run cap:copy
npm.cmd run android:bundle:release
```

Expected AAB:

```text
android/app/build/outputs/bundle/release/app-release.aab
```

After building, inspect the AAB as a ZIP. The packaged web files must match `www`
and contain `APP_IS_FREE = true`. Confirm the Android manifest has no Billing
permission and the native Billing plugin/dependency is absent.

Do not upload an AAB that contains a payment path.

## 5. Firebase deploys

Deploy the owner-only free journal rules before publishing the free app.
Payment Functions below are historical; do not deploy them for this migration.

Firestore rules deploy:

```powershell
npx.cmd firebase deploy --only firestore:rules --project peregrin-d7611
```

Function deploys are higher risk. Before deploying Functions:

- Confirm `verifyGooglePlayPurchase` is in `europe-west1`.
- Confirm `stripeWebhook` is in `us-central1`.
- Confirm environment variables/secrets are live, not test placeholders.
- Confirm Stripe webhook endpoints and events in Stripe Dashboard.
- Confirm Function runtime discovery works locally.

Avoid broad deploys such as:

```powershell
npx.cmd firebase deploy --only functions --project peregrin-d7611
```

Prefer targeted deploys only after verifying the function:

```powershell
npx.cmd firebase deploy --only functions:verifyGooglePlayPurchase --project peregrin-d7611
```

## 6. Play Console upload

After uploading an AAB:

- Confirm the release shows the new `versionCode`.
- Confirm the release is sent to review or fully rolled out as intended.
- Confirm managed publishing status.
- Confirm the purchase option for `peregrin_premium_all` remains inactive.
- If beta/internal tracks are involved, confirm testers and production rollout are
  not mixed unintentionally.

## 7. Post-release verification

After the release is approved and available:

- Check Play Console for crashes and ANRs.
- Open the live app and verify free-access copy, maps, guides and private notes.
- Confirm the service worker version and deployed assets match the release.
- For historical purchase issues, preserve receipts and direct users to the free update.

## 8. Commit and push

Before finishing:

```powershell
git status --short --branch
git diff --stat
```

Commit only the intended files, then push. Leave screenshots, local captures,
keystores, secrets, and generated junk out of commits unless intentionally needed.
