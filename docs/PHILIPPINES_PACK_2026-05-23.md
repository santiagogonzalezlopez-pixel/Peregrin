# Peregrin Philippines content pack

Last updated: 2026-05-23

## Scope

This is an additive country-pack experiment inside the existing Peregrin app.

Do not treat it as a second app yet. The intended launch shape is:

- Same Android package: `com.peregrin.app`
- Same Premium product and payment flow
- Same app code and user accounts
- Philippines-specific content, routes, Play Store listing, screenshots and outreach
- Philippines is free to discover and mark during the experiment

## Files

- `content-packs/philippines.js`
- `www/content-packs/philippines.js`

The pack is loaded after `app-data.js` and `route-guides.js`, then appends:

- Free access for the Philippines country pack
- 13 additional Philippines sanctuaries
- 3 Philippines routes
- 2 Philippines achievements
- A Philippines certificate rule for 7 core shrines
- Route guide text for the 3 new routes

The original `app-data.js` and `route-guides.js` are intentionally left untouched.

## Product Positioning

Suggested Play Store custom listing name:

```text
Peregrin Philippines - Catholic Pilgrim Passport
```

Short description:

```text
Discover Catholic shrines, Visita Iglesia routes and pilgrim memories across the Philippines.
```

Local line to verify with a native speaker before publishing:

```text
Tuklasin ang mga dambana, simbahan at ruta ng pananampalataya sa Pilipinas.
```

## Launch Checklist

1. Confirm Philippines is enabled in Play Console production countries/regions.
2. Create a Philippines custom store listing.
3. Use screenshots from:
   - Manila Visita Iglesia
   - Santo Nino Cebu Route
   - Marian Shrines of Luzon
4. Localize Premium price in Google Play Console. Suggested test points:
   - PHP 99
   - PHP 149
   - PHP 199
5. Create 30-50 Google Play promo codes for real Filipino Catholic users.
6. Ask for private feedback first; ask for public reviews only after real use.
7. Measure for 30-45 days:
   - Store listing visitors
   - Installs from the Philippines
   - Onboarding completion
   - First sanctuary opened
   - First visit registered
   - Premium unlocks or promo redemptions
   - Reviews and direct feedback

## Source Notes

Useful references consulted while preparing the pack:

- Philippine Statistics Authority: 2020 census religious affiliation.
  `https://psa.gov.ph/content/religious-affiliation-philippines-2020-census-population-and-housing?vcode=86`
- StatCounter: Philippines mobile OS market share.
  `https://gs.statcounter.com/os-market-share/mobile-/philippines`
- Google Play custom store listings.
  `https://play.google.com/console/about/customstorelistings/`
- Google Play promo codes.
  `https://support.google.com/googleplay/android-developer/answer/6321495`
- Baclaran Shrine official website.
  `https://www.baclaranchurch.org/home.html`
- Basilica Minore del Sto. Nino de Cebu official website.
  `https://santoninodecebubasilica.org/`
- UNESCO World Heritage Centre: Baroque Churches of the Philippines.
  `https://whc.unesco.org/en/list/677`
- Manila Cathedral official history.
  `https://www.manilacathedral.com.ph/history`
- Divine Mercy Shrine El Salvador.
  `https://divinemercyshrineelsalvador.org/`
- Cultural Center of the Philippines encyclopedia entry for Nuestra Senora de Guia.
  `https://epa.culturalcenter.gov.ph/3/82/2245/`

## Guardrails

- Do not touch Premium, Billing, Firebase Functions, Firestore rules, Stripe, or Android native code for this experiment.
- Do not split into a separate app until there is clear traction from the Philippines listing and content pack.
- Do not publish Tagalog/Filipino devotional copy without a native Catholic review.
- Keep the free Philippines access as an experiment. Reassess after 30-45 days with real install, activation and feedback data.
