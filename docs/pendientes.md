# Pendientes Peregrin

Last updated: 2026-06-17

## Production watch

- Watch Play Console for crashes, ANRs, reviews and purchase complaints.
- Confirm that Premium purchases keep unlocking correctly in production.
- Confirm that Africa, Holy Land and Oceania content, routes, certificates and
  hitos behave correctly for real users.
- Confirm that all five app continents stay visible in map filters, passport
  sharing, onboarding and Premium copy after the Oceania deployment.
- If any user pays but remains blocked, follow
  `docs/PAYMENT_INCIDENT_RUNBOOK.md` before changing code.
- Watch for any Firestore permission errors around editing/deleting own comments
  or deleting private journal notes after the next deploy.

## Highest-value next improvements

Release gate:

- Comment/note editing controls are ready for the next release after final smoke
  checks. Firestore rules were deployed on 2026-06-05.
- Next content expansion should follow the locked pilgrimage shortlist in
  `docs/PILGRIMAGE_CORE_SHORTLIST_2026-06-17.md`. Start with the Rome and Italy
  pack, ideally adding the Seven Pilgrim Churches of Rome as a coherent route.

Recently completed:

- Compact global map markers: when the full world map is shown at low zoom, the
  map now uses small dot markers; full sanctuary icons return when zooming in or
  filtering by country/route.
- Catholic atlas content audit created:
  `docs/CATHOLIC_ATLAS_CONTENT_AUDIT_2026-06-17.md`.
- Pilgrimage core shortlist created:
  `docs/PILGRIMAGE_CORE_SHORTLIST_2026-06-17.md`.
- Holy Land prestige pack with 10 Gospel places, one route, one certificate rule
  and one pilgrim hito.
- Oceania pack with 4 countries, 8 sanctuaries, one route, country certificate
  rules for Australia/New Zealand, fallback rules for Fiji/Papua New Guinea and
  one pilgrim hito.
- Certificate redesign: ceremonial wording, reviewed multilingual strings,
  richer photographic route imagery, formal seal/count layout and QA renders for
  Spanish, French/Holy Land and Portuguese/Oceania cases.
- First category-based sanctuary hero image pass: Marian, monastery, mountain
  and martyr/relic imagery.
- Edit/delete controls for a pilgrim's own public sanctuary comments, plus delete
  control for private journal notes.

- Next round should be a polish round, not a quantity/content expansion round.
- Explore a stronger visit-registration flow: to earn a stamp, the pilgrim
  should write a private note and a public comment/tip for other pilgrims. This
  would make "I was here" feel more meaningful than a tap from the sofa.
- Redesign the individual passport stamps so they feel like real collectible
  pilgrimage stamps: texture, circular seal language, sanctuary name, country and
  date treated like an elegant postmark.
- Next update idea: make each individual sanctuary visit/stamp shareable as its
  own beautiful image, even without completing a route, unlocking an achievement
  or generating a full passport. Example: a pilgrim visits Sagrada Familia and
  can immediately save/share a polished Sagrada Familia stamp memory.
- Keep refining sanctuary detail imagery over time, preferably adding more
  categories only when it clearly improves the app.
- Consider a simple `My memories` / `My path` screen without new backend:
  latest visits, unlocked achievements, countries in progress and a clear
  passport-share action.
- Rework Premium copy so it does not feel like "pay to unlock countries" only,
  but like "keep and share a richer pilgrimage memory": routes, certificates,
  beautiful passport, achievements and saved milestones.
- Keep future certificate work to small polish unless user asks for another
  redesign.
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
- Do not require GPS/geolocation for stamps. It would be unfair to real pilgrims
  who visited sanctuaries before installing Peregrin and should not have to
  travel again just to claim a memory.
- Avoid a "prove where you are" tone; the product should validate memory and
  contribution, not police physical presence.
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

- Guadalupe/Mexico Spanish-first pack.
- Caribbean sanctuary pass, starting with Dominican Republic research and any
  major Catholic pilgrimage places there.
- Rome/Jubilee-style premium pack.
- Korea/WYD 2027 pilgrim pack.
- Apple App Store feasibility pass, once Android production has settled.
