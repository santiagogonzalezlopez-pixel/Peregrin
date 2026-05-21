# Peregrin release checklist

Last updated: 2026-05-21

Use this checklist before any production release. Payments and Premium are real
money flows, so do not skip evidence steps.

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

## 2. Premium invariants to preserve

These must remain true unless there is a deliberate migration:

- `GOOGLE_PLAY_CHECKOUT_ENABLED` remains `true` for Android production.
- Google Play product ID remains `peregrin_premium_all`.
- Stripe Payment Link remains the current live link unless intentionally changed.
- Both emergency codes remain valid:

```text
PEREGRIN-388066-6291
PEREGRIN-PREMIUM-2026
```

- Firestore rules still allow the emergency Premium codes.
- Android restore purchase still exists.
- Paid Google Play purchase with a returned token must not leave a user blocked.

## 3. Web checks

Before deploying web files:

- Confirm changes are in `index.html`.
- If Capacitor/Android must receive the change, also run `npm.cmd run cap:copy`.
- Search for the expected payment markers:

```powershell
rg -n "PEREGRIN-388066-6291|PEREGRIN-PREMIUM-2026|grantEmergencyPremiumAfterGooglePlayCharge|restoreGooglePlayPremium|bJeeVfbotaZBaVZgSofEk01" index.html www/index.html
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

After building, inspect the AAB as a ZIP and verify that
`base/assets/public/index.html` contains the production Premium markers:

```text
PEREGRIN-388066-6291
PEREGRIN-PREMIUM-2026
grantEmergencyPremiumAfterGooglePlayCharge
restoreGooglePlayPremium
bJeeVfbotaZBaVZgSofEk01
```

Do not upload an AAB if those markers are missing.

## 5. Firebase deploys

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
- Confirm the in-app product `peregrin_premium_all` is active and priced.
- If beta/internal tracks are involved, confirm testers and production rollout are
  not mixed unintentionally.

## 7. Post-release verification

After the release is approved and available:

- Check Play Console for crashes and ANRs.
- Check Firebase logs:

```powershell
npx.cmd firebase functions:log --only verifyGooglePlayPurchase --project peregrin-d7611 -n 100
```

- Watch for:

```text
google_play_purchase_lookup_failed
403
unauthenticated
already-exists
```

- If a real user reports "paid but not Premium", follow
  `docs/PAYMENT_INCIDENT_RUNBOOK.md` immediately.

## 8. Commit and push

Before finishing:

```powershell
git status --short --branch
git diff --stat
```

Commit only the intended files, then push. Leave screenshots, local captures,
keystores, secrets, and generated junk out of commits unless intentionally needed.

