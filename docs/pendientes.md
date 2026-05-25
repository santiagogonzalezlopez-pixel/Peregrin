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
- Explore a stronger visit-registration flow: to earn a stamp, the pilgrim
  should write a private note and a public comment/tip for other pilgrims. This
  would make "I was here" feel more meaningful than a tap from the sofa.
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
- Turn each visit into memory plus contribution: private note for the user,
  public practical/devotional comment for the community, and then the stamp.
- Review Play Store screenshots after the production version settles.
- Consider a focused landing page or custom listing for the strongest market
  packs once real usage data exists.

## Visit authenticity idea

- Goal: reduce fake/empty stamp collecting and make every stamp carry a small
  memory.
- Safe first version: require a private note plus a public comment before
  registering a sanctuary visit.
- Keep the comment short, link-free and moderate/reportable with existing
  comment safeguards.
- Do not require GPS in the first version; it can create permission, privacy and
  false-negative problems.
- Possible later version: optional "verified nearby" badge if the user grants
  location and is physically near the sanctuary.
- Product tone: not policing pilgrims, but asking them to leave a trace of the
  pilgrimage for themselves and a helpful note for others.

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
