# Data Audit — 2026-04-20

## Executive Summary

The dataset is structurally healthier than expected.

- `111` sanctuaries across `23` countries.
- No duplicate sanctuary ids.
- No duplicate `(country, name, city)` pairs.
- No routes pointing to missing sanctuary ids.
- No achievements pointing to missing sanctuary ids.
- No broken certificate rules.
- No missing `es`, `fr`, `it`, or `pt` translation blocks in sanctuary data.

The main risk is not technical consistency. The main risk is **editorial asymmetry**:
some countries feel reasonably complete, while others look thin enough to make the app feel selective or unfinished.

## Highest-Risk Countries

These are the countries most likely to hurt trust because their coverage is very small:

1. Bosnia and Herzegovina (`ba`): `1` sanctuary
2. Peru (`pe`): `3` sanctuaries
3. Croatia (`hr`): `4` sanctuaries
4. Brazil (`br`): `4` sanctuaries
5. Argentina (`ar`): `4` sanctuaries
6. Bolivia (`bo`): `4` sanctuaries
7. Colombia (`co`): `4` sanctuaries
8. India (`in`): `4` sanctuaries
9. South Korea (`kr`): `4` sanctuaries
10. Japan (`jp`): `4` sanctuaries

These counts are not automatically wrong, but they are where users are most likely to think:
"Why are there so few here?" or "Is this country incomplete?"

## Certificate and Belgium Check

Belgium is internally consistent now:

- Belgium sanctuary count in data: `7`
- Belgium certificate rule: `7`
- Belgium achievement rule: `7`

This means the old "Belgium shows 12" issue is not present in the current local dataset.

## Belgium External Verification

A first factual verification pass for Belgium supports the current set of `7` entries.

Externally corroborated:

- Scherpenheuvel basilica / pilgrimage shrine
- Koekelberg Sacred Heart basilica / national shrine
- Basilica of the Holy Blood in Bruges
- Sanctuary of Beauraing
- Sanctuary of Banneux
- Orval Abbey
- Basilica of Saint Martin in Halle / centre of devotion to Our Lady

Conclusion:

- Belgium no longer looks structurally wrong.
- Belgium should still be manually reviewed one entry at a time for wording and category quality.
- But the current local list does not look like a random or fabricated set.

## Bosnia and Herzegovina Review

Bosnia and Herzegovina currently contains only one sanctuary in the dataset:

- Medjugorje

A factual check supports keeping Medjugorje in the app. The official Medjugorje parish site presents it as an active pilgrimage destination, and the Vatican's September 19, 2024 note on the spiritual experience connected with Medjugorje describes it as a major pilgrimage destination with evident pastoral fruits.

Product recommendation:

- Keep Medjugorje.
- Do not offer a Bosnia and Herzegovina country certificate yet.
- Re-enable that certificate only when the country has broader and more deliberate coverage.

Reason:

- With only one sanctuary, the current country-certificate mechanic makes Bosnia feel artificially easy and weakens trust in the rest of the passport.
- This is not a data-corruption problem. It is a product-integrity problem.

## Peru Review

Peru currently contains three sanctuaries in the dataset:

- Church of Las Nazarenas
- Cathedral of Cusco
- Sanctuary of Our Lady of Chapi

These three entries are defensible. Las Nazarenas is strongly tied to the Lord of Miracles devotion in Lima, the Cathedral of Cusco is an active archdiocesan centre, and Chapi remains one of the strongest Marian pilgrimages in southern Peru.

At the same time, Peru looks editorially incomplete rather than intentionally finished. Pope Francis, in his Marian celebration in Trujillo on January 20, 2018, publicly invoked several other major Peruvian devotions and pilgrimage centres not currently represented in the app, including Otuzco and Ayabaca.

Product recommendation:

- Keep the current three Peruvian entries.
- Do not offer a Peru country certificate yet.
- Re-enable that certificate only after a deliberate Peru pass that decides whether to add more national devotions or explicitly keep Peru as a narrower curated set.

Reason:

- The current Peru set is not wrong, but it is too thin to support the idea of "complete Peru".
- Leaving the certificate active would communicate editorial completeness that the current data does not yet earn.

## Croatia Review

Croatia currently contains four sanctuaries in the dataset:

- Cathedral of Saint Domnius
- Zagreb Cathedral
- Sanctuary of Our Lady of Trsat
- Cathedral of Saint James

These four entries are defensible.

- Split's Cathedral of Saint Domnius is clearly still an active liturgical and pilgrimage site in the city's official feast program for Saint Domnius.
- Zagreb Cathedral is the country's best-known cathedral and remains central to the religious identity of Zagreb despite the post-2020 earthquake restoration.
- Trsat is presented by the official Rijeka tourism materials as the largest pilgrimage centre of Western Croatia.
- Šibenik Cathedral is a protected UNESCO cathedral of major national significance.

At the same time, the current Croatia set is not editorially complete enough to support a country certificate.

The strongest warning sign is omission, not bad data:

- The Archdiocese of Zagreb describes Marija Bistrica as the most known Croatian shrine of St. Mary and the central place of worship of the Croatian people for centuries.
- The same archdiocesan shrine directory also lists the National Shrine of St. Joseph in Karlovac.

Product recommendation:

- Keep the current four Croatian entries.
- Do not offer a Croatia country certificate yet.
- Re-enable that certificate only after a focused Croatia pass that decides whether to add the major missing national shrines or intentionally redefine Croatia as a much narrower curated set.

Reason:

- The current entries are good, but they do not justify the claim of "completed Croatia".
- Leaving the certificate active would turn a decent shortlist into an overstatement.

## Country Counts

Full sanctuary count by country:

- Argentina: `4`
- Austria: `5`
- Belgium: `7`
- Bolivia: `4`
- Bosnia and Herzegovina: `1`
- Brazil: `4`
- Canada: `5`
- Colombia: `4`
- Croatia: `4`
- France: `6`
- Germany: `5`
- India: `4`
- Ireland: `5`
- Italy: `7`
- Japan: `4`
- Mexico: `5`
- Peru: `3`
- Philippines: `5`
- Poland: `5`
- Portugal: `6`
- South Korea: `4`
- Spain: `7`
- United States: `7`

## What I Would Do Next

Do not expand the app broadly.

Instead:

1. Review the lowest-coverage countries first.
2. Decide country by country whether the current count is intentionally curated or actually incomplete.
3. If a country is intentionally curated, keep it but be confident in every included sanctuary.
4. If a country is incomplete, either complete it properly or leave it out for now.

## Recommended Review Order

1. Bosnia and Herzegovina
2. Peru
3. Belgium
4. Croatia
5. Brazil
6. Argentina
7. Colombia
8. Bolivia
9. India
10. Japan
11. South Korea

Belgium stays high on the list not because it is structurally broken, but because it already caused trust issues and should be manually re-verified.

## Editorial Notes

The next likely content problem is not Belgium. It is countries with very thin coverage.

In particular:

- Bosnia and Herzegovina has only `1` sanctuary.
- Peru has only `3` sanctuaries.

Those may be intentionally curated, but they are the places most likely to trigger the feeling that the app is incomplete.

## Tooling

A repeatable audit script is available at:

- [audit-peregrin-data.js](C:/Users/Admin/peregrin-app/tools/audit-peregrin-data.js:1)

Run it with:

```powershell
node .\tools\audit-peregrin-data.js
```
