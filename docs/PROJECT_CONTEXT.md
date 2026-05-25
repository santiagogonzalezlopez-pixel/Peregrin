# Peregrin project context

Last updated: 2026-05-25

## Current milestone

Peregrin is now in production on Google Play.

This is the first stable production baseline after the tester phase, the Google
Play Billing work, the Premium unlock fixes, the certificate fixes, the route
image refresh, the Africa content pack, the achievement diplomas and the
shareable pilgrim passport.

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
- Current Android version in repo: `versionCode 42`, `versionName 1.0.41`
- Latest production-prep commit at this checkpoint: `15853d6`
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
- Achievement diplomas with share/download preview.
- Shareable `PEREGRIN PASSPORT` image generated from obtained stamps.

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

- Do not add more quantity by default. The next useful pass is aesthetic and
  emotional: make existing moments more desirable to open, save and share.
- Make individual passport stamps more like real collectible pilgrimage stamps:
  textured, circular, elegant and date/country aware.
- Improve sanctuary detail imagery with category-based sacred visuals instead of
  one repeated generic image.
- Consider a simple `My memories` / `My path` screen using existing local/user
  data: latest visits, unlocked achievements, countries in progress and passport
  sharing.
- Consider making each stamp require a small act of memory/contribution: a
  private note for the pilgrim and a public comment/tip for others before the
  visit is registered.
- Improve Premium copy so the value is framed as a richer pilgrimage memory, not
  only a country unlock.
- Do a small visual-detail pass for spacing, long translations, buttons, empty
  states and navigation icons.
- Keep payment code, billing code and production release mechanics stable unless
  there is a real bug.
- Avoid big rewrites while the production app is behaving correctly.

Visit authenticity principle:

- Prefer "leave a trace of your pilgrimage" over "prove you were there".
- A safe first version is notes/comments required before earning a stamp.
- GPS should be optional and later, as a "verified nearby" enhancement, because
  mandatory location can create privacy friction, permission issues and false
  negatives at real sanctuaries.

## Operating principle

Production mode means small, intentional changes.

Before any future release:

- Read `docs/APP_OPERATIONS.md`.
- Read `docs/RELEASE_CHECKLIST.md`.
- Run the data audit.
- Build a fresh AAB only after the intended changes are clear.
- Do not stage old screenshots, local captures, secrets or unrelated files.
