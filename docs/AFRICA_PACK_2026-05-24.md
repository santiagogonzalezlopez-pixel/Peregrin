# Peregrin Africa content pack

Last updated: 2026-05-24

## Scope

This is an additive Africa essentials pack inside the existing Peregrin app.

It intentionally avoids payments, Firebase, native Android code and existing certificate logic. The goal is to make Africa visible in the pilgrim passport with a small, curated first selection of Catholic landmarks.

## Files

- `content-packs/africa.js`
- `www/content-packs/africa.js`
- `assets/routes/africa.svg`
- `www/assets/routes/africa.svg`

## Adds

- 7 African countries
- 8 Catholic sanctuaries or landmark churches
- 1 long-term Africa route
- 1 Africa achievement
- A two-site Algeria certificate rule

## First Selection

- Basilica of Our Lady of Peace, Yamoussoukro, Cote d'Ivoire
- Basilica of Our Lady of Africa, Algiers, Algeria
- Basilica of Saint Augustine, Annaba, Algeria
- Shrine of Our Lady of Kibeho, Rwanda
- Uganda Martyrs Basilica, Namugongo, Uganda
- Sanctuary of Our Lady of Muxima, Angola
- National Marian Shrine of Subukia, Kenya
- Basilica of Sainte-Anne-du-Congo, Brazzaville, Republic of the Congo

## Source Notes

Useful references consulted while preparing the pack:

- Basilica of Our Lady of Peace official site: `https://basiliquenotredame-delapaix.com/`
- Catholic Church in Algeria, Notre-Dame d'Afrique: `https://eglise-catholique-algerie.org/eglise-algerie/diocese-alger/notre-dame-d-afrique/`
- Catholic Church in Algeria, Basilica of Saint Augustine: `https://eglise-catholique-algerie.org/eglise-algerie/diocese-constantine-hippone/basilique-saint-augustin-annaba/`
- Vatican News on Kibeho: `https://www.vaticannews.va/fr/afrique/news/2021-11/rwanda-40-ans-des-apparitions-a-kibeho.html`
- Uganda Martyrs Shrine context: `https://www.ugandamartyrsshrine.org.ug/`
- ACI Africa on Muxima pilgrimage: `https://www.aciafrica.org/news/16943/upcoming-pilgrimage-to-our-lady-of-muxima-shrine-time-of-grace-in-angola-official`
- Kenya Friars on Subukia: `https://kenyafriars.org/subukia/`

## Guardrails

- Keep this as a compact v1. Do not expand to a full continent atlas until the production version has stabilized.
- Avoid mixing Catholic sites with Orthodox, Coptic Orthodox or general Christian heritage sites unless the app explicitly labels that distinction.
- Keep country packs additive and reversible.
