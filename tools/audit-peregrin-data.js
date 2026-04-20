const fs = require("fs");
const path = require("path");
const vm = require("vm");

const projectRoot = path.resolve(__dirname, "..");
const appDataPath = path.join(projectRoot, "www", "app-data.js");
const source = fs.readFileSync(appDataPath, "utf8");

const context = { window: {}, console };
vm.createContext(context);
vm.runInContext(source, context);

const data = context.window.PEREGRIN_DATA;
const sanctuaryIds = new Set();
const duplicateIds = [];
const countryCounts = new Map();
const duplicateNameCity = new Map();

for (const sanctuary of data.sanctuaries) {
  if (sanctuaryIds.has(sanctuary.id)) duplicateIds.push(sanctuary.id);
  sanctuaryIds.add(sanctuary.id);

  countryCounts.set(sanctuary.country, (countryCounts.get(sanctuary.country) || 0) + 1);

  const key = `${sanctuary.country}|${String(sanctuary.name).toLowerCase()}|${String(
    sanctuary.city
  ).toLowerCase()}`;
  if (!duplicateNameCity.has(key)) duplicateNameCity.set(key, []);
  duplicateNameCity.get(key).push(sanctuary.id);
}

const countriesById = new Map(data.countries.map((country) => [country.id, country]));

const translationIssues = [];
for (const sanctuary of data.sanctuaries) {
  for (const lang of ["es", "fr", "it", "pt"]) {
    if (!sanctuary[lang]) {
      translationIssues.push({ id: sanctuary.id, country: sanctuary.country, lang, reason: "missing object" });
      continue;
    }
    for (const field of ["name", "type", "city", "province", "description", "history", "prayer", "feast"]) {
      if (!sanctuary[lang][field]) {
        translationIssues.push({
          id: sanctuary.id,
          country: sanctuary.country,
          lang,
          reason: `missing ${field}`,
        });
      }
    }
  }
}

const routeIssues = [];
for (const route of data.routes) {
  const missingStops = route.stops.filter((id) => !sanctuaryIds.has(id));
  if (missingStops.length) routeIssues.push({ id: route.id, missingStops });
}

const achievementIssues = [];
for (const achievement of data.achievements) {
  if (!Array.isArray(achievement.ids)) continue;
  const missingIds = achievement.ids.filter((id) => !sanctuaryIds.has(id));
  if (missingIds.length) {
    achievementIssues.push({ id: achievement.id, missingIds });
  }
}

const certificateIssues = [];
for (const [countryId, rule] of Object.entries(data.certificateRules || {})) {
  const missingIds = (rule.sanctuaryIds || []).filter((id) => !sanctuaryIds.has(id));
  if (missingIds.length) certificateIssues.push({ countryId, missingIds });
}

const lowCoverage = [...countryCounts.entries()]
  .filter(([, count]) => count <= 4)
  .sort((a, b) => a[1] - b[1])
  .map(([countryId, count]) => ({
    countryId,
    countryName: countriesById.get(countryId)?.name || countryId,
    count,
    ids: data.sanctuaries.filter((sanctuary) => sanctuary.country === countryId).map((sanctuary) => sanctuary.id),
  }));

const countryCountRows = [...countryCounts.entries()]
  .map(([countryId, count]) => ({
    countryId,
    countryName: countriesById.get(countryId)?.name || countryId,
    count,
  }))
  .sort((a, b) => a.countryName.localeCompare(b.countryName));

const report = {
  generatedAt: new Date().toISOString(),
  totals: {
    countries: data.countries.length,
    sanctuaries: data.sanctuaries.length,
    routes: data.routes.length,
    achievements: data.achievements.length,
  },
  duplicateIds,
  duplicateNameCity: [...duplicateNameCity.entries()]
    .filter(([, ids]) => ids.length > 1)
    .map(([key, ids]) => ({ key, ids })),
  translationIssues,
  routeIssues,
  achievementIssues,
  certificateIssues,
  lowCoverage,
  countryCountRows,
};

console.log(JSON.stringify(report, null, 2));
