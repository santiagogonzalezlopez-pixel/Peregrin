# Pendientes Peregrin

Last updated: 2026-06-24

## Production watch

- Fix the Google Play Console Payments profile warning shown on 2026-06-20. The
  in-app product is active, but monetization trust should not remain with a
  payments-profile warning.
- Watch Play Console for crashes, ANRs, reviews and purchase complaints.
- Confirm that Premium purchases keep unlocking correctly in production.
- Confirm that Africa, Holy Land, Oceania, Rome/Italy, France/Europe,
  Americas/Caribbean and Asia/Africa content, routes, certificates and hitos
  behave correctly for real users.
- Confirm that all five app continents stay visible in map filters, passport
  sharing, onboarding and Premium copy after the Oceania deployment.
- If any user pays but remains blocked, follow
  `docs/PAYMENT_INCIDENT_RUNBOOK.md` before changing code.
- Watch for any Firestore permission errors around editing/deleting own comments
  or deleting private journal notes after the next deploy.
- Comment notification emails are active through Brevo SMTP after the
  2026-06-18 deploy of `notifyNewSanctuaryComment` and
  `notifyReportedSanctuaryComment`. Keep the SMTP key rotated if it is ever
  exposed.

## Highest-value next improvements

Release gate:

- Rome/Italy, France/Europe, Americas/Caribbean and Asia/Africa packs are ready
  after data audit and smoke checks. Together they add 45 major pilgrimage
  places, twenty-seven new countries, the Seven Pilgrim Churches of Rome route
  and eight hitos.
- The locked pilgrimage shortlist in
  `docs/PILGRIMAGE_CORE_SHORTLIST_2026-06-17.md` is complete. Future content
  additions should be deliberate first-division pilgrim places, not quantity for
  quantity's sake.

Recently completed:

- Android release 62 / 1.0.61 AAB built with the Milk Grotto added to the Holy
  Land route and Premium totals updated to 62 countries / 209 sanctuaries.
- Firebase Hosting and Firestore rules deployed for the analytics-enabled web
  build.
- Android release 61 / 1.0.60 AAB built with `My path`, first-party analytics
  instrumentation and updated privacy policy.
- `My path` / `Mi camino` section added with existing user data.
- Privacy-respectful first-party analytics instrumentation added for app opens,
  screen/country/sanctuary/route opens, visit actions, share/certificate actions
  and Premium flow outcomes.
- Firestore `analyticsEvents` rules added: signed-in create only, no client read,
  update or delete.
- Privacy policy updated to disclose basic app activity events and state that
  they are not used for advertising or behavioural profiling.
- Stripe product copy updated in the Dashboard and verified on the public
  Checkout page: `62 paises / 209 santuarios`.
- Android release 60 / 1.0.59 built with the passport stamp visual polish.
- Comment notification emails fixed with Brevo SMTP and verified in Firebase
  logs.
- First passport stamp visual polish pass: textured on-screen stamps and more
  collectible shareable passport/stamp cards.
- Americas/Caribbean pack with 10 pilgrimage places, ten new countries and two
  pilgrimage hitos.
- Asia/Africa pack with 11 pilgrimage places, ten new countries and two
  pilgrimage hitos.
- Rome/Italy pack with 10 pilgrimage places, the Seven Pilgrim Churches of Rome
  route, multilingual guide copy and two pilgrimage hitos.
- France/Europe pack with 14 pilgrimage places, seven new countries and two
  pilgrimage hitos.
- Compact global map markers: when the full world map is shown at low zoom, the
  map now uses small dot markers; full sanctuary icons return when zooming in or
  filtering by country/route.
- Catholic atlas content audit created:
  `docs/CATHOLIC_ATLAS_CONTENT_AUDIT_2026-06-17.md`.
- Pilgrimage core shortlist created:
  `docs/PILGRIMAGE_CORE_SHORTLIST_2026-06-17.md`.
- Holy Land prestige pack with 11 Gospel places, one route, one certificate rule
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

Next version should stay limited to three low-risk priorities:

- Build and upload the next AAB with `My path`, share polish and analytics.
- Create the first focused Play Store acquisition door: title/short description
  and one custom listing around a concrete Catholic pilgrim-passport intent.
  Use `docs/PLAY_STORE_GROWTH_ACTIONS_2026-06-20.md` as the execution sheet.
- Do a small visual-detail pass across spacing, long translated strings, buttons,
  empty states and navigation icons only after the release-critical checks pass.

Avoid for the next version:

- Do not add more pilgrimage content unless a first-division omission is found.
- Do not require notes/comments before earning a stamp yet; it is conceptually
  good but risks destabilizing registration and comments.
- Do not touch payments, login, comments or certificate generation unless a real
  bug appears.

## Growth and visibility

- Current Play Console baseline on 2026-06-20: 16 users with the app downloaded,
  9 device acquisitions in the last 28 days, 5 first opens, 13 monthly active
  users, 1 retained at 7 days, and 32.76% default listing conversion.
- Interpretation: the urgent issue is discovery/distribution, not yet proof of
  product rejection. Conversion is plausible; traffic is tiny.
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

- Stripe product copy is current as of 2026-06-20. Keep the existing Payment Link
  for copy-only updates.
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
- Deeper Rome/Jubilee polish only if real usage suggests it.
- Korea/WYD 2027 pilgrim pack.
- Apple App Store feasibility pass, once Android production has settled.
