# Oceania pack 2026-06-02

## Scope

This pack gives Peregrin first Pacific coverage without turning the release into a
large content dump.

- Countries: Australia (`au`), New Zealand (`nz`), Fiji (`fj`), Papua New Guinea
  (`pg`).
- Sanctuaries: 8.
- Route: `oceania-catholic-landmarks`.
- Achievement: `oceania`.
- Certificates: explicit country rules for Australia and New Zealand; default
  all-country rules cover Fiji and Papua New Guinea.
- Visual: photographic-style route banner at `assets/routes/oceania.png` and
  `www/assets/routes/oceania.png`.

## App files

- `content-packs/oceania.js`
- `www/content-packs/oceania.js`
- `assets/routes/oceania.png`
- `www/assets/routes/oceania.png`
- `index.html` and `www/index.html`
- `share-cards.js` and `www/share-cards.js`
- `sw.js` and `www/sw.js`

## Selection notes

The first eight sites are intentionally conservative: cathedral basilicas, Marian
shrines, saint memory, national dedication and a recent papal-visit shrine. The
route is framed as a long-term Pacific horizon rather than a literal one-trip
itinerary, because the stops are very far apart.

## Source notes

- St Mary's Cathedral Sydney: https://www.sydneycatholic.org/about-us/st-marys-cathedral/
- Mary MacKillop Memorial Chapel: https://www.marymackillopplace.org.au/visit/memorial-chapel/
- St Patrick's Cathedral Melbourne: https://melbournecatholic.org/about/st-patricks-cathedral
- Our Lady of Victories Basilica Camberwell: https://ourladyofpentecost.org.au/our-churches/our-lady-of-victories-basilica/
- St Patrick and St Joseph's Cathedral Auckland: https://stpatricks.org.nz/about-the-cathedral/
- St Mary of the Angels / Te Ara a Maria: https://smoa.org.nz/national-shrine/
- Sacred Heart Cathedral Suva: https://www.im.va/content/gdm/en/mondo/porte-della-misericordia.event.sacred-heart-cathedral-archdiocese-of-suva.html
- Shrine of Mary Help of Christians Port Moresby: https://www.vatican.va/content/francesco/en/events/event.dir.html/content/vaticanevents/en/2024/9/7/papua-nuovaguinea-religiosi.html

## Guardrails

- Keep both root and `www` copies synchronized.
- Keep counts synchronized at 35 countries, 150 sanctuaries, 13 routes and 5
  continents.
- Keep `content-packs/oceania.js` in the service-worker precache.
- Keep the route image as a real raster asset, not an SVG placeholder.
- Run `node tools/audit-peregrin-data.js` before deploying Firebase Hosting.
