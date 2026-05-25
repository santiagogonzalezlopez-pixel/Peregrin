# Pendientes Peregrin

Last updated: 2026-05-25

## Production watch

- Watch Play Console for crashes, ANRs, reviews and purchase complaints.
- Confirm that Premium purchases keep unlocking correctly in production.
- Confirm that Africa content, routes and certificates behave correctly for real
  users.
- If any user pays but remains blocked, follow
  `docs/PAYMENT_INCIDENT_RUNBOOK.md` before changing code.

## Highest-value next improvements

- Next round should be a polish round, not a quantity/content expansion round.
- Redesign the individual passport stamps so they feel like real collectible
  pilgrimage stamps: texture, circular seal language, sanctuary name, country and
  date treated like an elegant postmark.
- Improve sanctuary detail cards with higher-quality generic sacred imagery,
  preferably by category: cathedral, Marian basilica, monastery, mountain,
  relic, Holy Land, etc.
- Consider a simple `My memories` / `My path` screen without new backend:
  latest visits, unlocked achievements, countries in progress and a clear
  passport-share action.
- Rework Premium copy so it does not feel like "pay to unlock countries" only,
  but like "keep and share a richer pilgrimage memory": routes, certificates,
  beautiful passport, achievements and saved milestones.
- Do a small visual-detail pass across spacing, long translated strings, buttons,
  empty states and navigation icons.
- Improve the visual language of map markers only if it can be done safely and
  consistently without destabilizing the map.

## Growth and visibility

- Prepare a small sharing loop: complete route/country, see beautiful result,
  share/save image.
- Review Play Store screenshots after the production version settles.
- Consider a focused landing page or custom listing for the strongest market
  packs once real usage data exists.

## External admin

- Update old Stripe product copy if it still says `23 countries / 111 sanctuaries`.
- Keep the Google Play product ID unchanged: `peregrin_premium_all`.
- Keep emergency Premium codes available unless there is a deliberate replacement
  plan.

## Not for the next immediate release

- Do not add chat, forums or a social network until the core product has stable
  traction.
- Do not make a large index split/refactor while production is stable unless it is
  planned and tested as its own technical release.
- Do not expand to many more sanctuaries just to increase numbers; prefer focused,
  meaningful packs with strong presentation.

## Possible future themes

- Holy Land prestige pack, with careful editorial tone.
- Guadalupe/Mexico Spanish-first pack.
- Rome/Jubilee-style premium pack.
- Korea/WYD 2027 pilgrim pack.
- Apple App Store feasibility pass, once Android production has settled.
