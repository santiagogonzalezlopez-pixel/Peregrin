# Peregrin project context

Last updated: 2026-05-24

## Current milestone

Peregrin is now in production on Google Play.

This is the first stable production baseline after the tester phase, the Google
Play Billing work, the Premium unlock fixes, the certificate fixes, the route
image refresh, and the Africa content pack.

Treat this moment as a production checkpoint: future work should improve the app,
not reopen broad risky refactors unless there is a clear reason.

## Source of truth

- Local project: `C:\Users\Admin\peregrin-app`
- GitHub repo: `https://github.com/santiagogonzalezlopez-pixel/Peregrin.git`
- GitHub Pages: `https://santiagogonzalezlopez-pixel.github.io/Peregrin/`
- Android package: `com.peregrin.app`
- Firebase project: `peregrin-d7611`

## Current release baseline

- Last built AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- Current Android version in repo: `versionCode 39`, `versionName 1.0.38`
- Latest production-prep commit at this checkpoint: `7f1bfd9`
- Content total after Africa pack: 30 countries, 132 sanctuaries, 11 routes

## What is considered stable

- Android production build pipeline via Capacitor.
- Premium purchase path through Google Play Billing.
- Premium unlock by emergency/family code.
- Stripe web payment link path, with the known caveat below.
- Country and route certificates after previous layout fixes.
- Login/register language controls.
- Onboarding and "what is Peregrin" explanation.
- Map filtering for countries/routes.
- Route cards with photographic banners.
- Africa pack added as a first African presence.

## Known external caveat

Stripe Dashboard may still have old product copy mentioning `23 countries / 111
sanctuaries`. This is external Stripe metadata and should be edited manually in
Stripe Dashboard, not by creating a new payment link or changing payment code.

Recommended Stripe product description:

```text
Unlock all 30 countries, 132 sanctuaries, every certificate, route and achievement. One-time payment, yours forever.
```

Spanish equivalent if needed:

```text
Desbloquea los 30 paises, 132 santuarios, todos los certificados, rutas y logros. Pago unico, tuyo para siempre.
```

## Product direction after production

The next phase is not "more data for the sake of more data". The app needs more
beauty, shareability and emotional reward.

Priority direction:

- Make achievement seals more beautiful and collectible.
- Make passport stamps more premium, devotional and shareable.
- Improve visual reward moments so users want to save, show and share them.
- Keep payment code, billing code and production release mechanics stable unless
  there is a real bug.
- Avoid big rewrites while the production app is behaving correctly.

## Operating principle

Production mode means small, intentional changes.

Before any future release:

- Read `docs/APP_OPERATIONS.md`.
- Read `docs/RELEASE_CHECKLIST.md`.
- Run the data audit.
- Build a fresh AAB only after the intended changes are clear.
- Do not stage old screenshots, local captures, secrets or unrelated files.
