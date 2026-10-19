const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function source(name) {
  const start = html.match(new RegExp('^(?:async )?function '+name+'\\(.*$', 'm'));
  assert.ok(start, name);
  if (start[0].endsWith('}')) return start[0];
  return html.slice(start.index).match(/^[^]*?^}/m)[0];
}
function app() {
  const elements = {'premium-card-content':{innerHTML:''}, 'premium-modal':{classList:{add(){}}},
    'journal-input-1':{value:'A private memory'},'journal-state-1':{textContent:''}};
  const state = {window:{}, console, currentLang:'es', unlockedRegions:[], visits:{},
    document:{getElementById:id=>elements[id]},showToast(){},Date};
  vm.createContext(state);
  for(const file of ['app-data.js','route-guides.js',...fs.readdirSync(path.join(root,'content-packs')).filter(f=>f.endsWith('.js')).map(f=>'content-packs/'+f)]){
    vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),state,{filename:file});
  }
  Object.assign(state,state.window.PEREGRIN_DATA);
  vm.runInContext(html.slice(html.indexOf('const i18n ='),html.indexOf('const PLAY_REVIEW_STORAGE_KEY')),state);
  for(const name of ['hasFullPremiumAccess','getRegion','isRegionUnlocked','isCountryUnlocked',
    'areAllRegionsUnlocked','openPremiumModal','renderJournalSection','saveJournalNote','loadJournalNote',
    'getCertificateSanctuaries','isCertificateUnlocked','isVisited'])vm.runInContext(source(name),state);
  return {state,elements};
}
test('every country and feature is open without a paid entitlement',()=>{
  const {state}=app();
  assert.equal(state.countries.length,69);
  for(const regions of [[],['europe'],['all']]){
    state.unlockedRegions=regions;
    assert.equal(state.hasFullPremiumAccess(),true);
    assert.equal(state.areAllRegionsUnlocked(),true);
    for(const c of state.countries)assert.equal(state.isCountryUnlocked(c.id),true,c.id);
  }
});
test('all five languages explain free access with no purchase controls',()=>{
  const {state,elements}=app();
  for(const lang of ['en','es','fr','it','pt']){
    state.currentLang=lang; state.openPremiumModal();
    const copy=elements['premium-card-content'].innerHTML;
    assert.ok(copy.includes(state.t('freeAccessBody')));
    assert.doesNotMatch(copy,/handleRegionPurchase|restore|premium-cta/);
    assert.doesNotMatch(copy.replace(/<[^>]*>/g,''),/Premium|€/);
    const journal=state.renderJournalSection({id:1});
    assert.match(journal,/journal-input-1/);
    assert.doesNotMatch(journal,/locked|premium-teaser/);
  }
});
test('private journal saves and reloads for an ordinary unpaid account',async()=>{
  const {state,elements}=app(); let saved;
  state.window._currentUser={uid:'free-pilgrim'};
  state.window._fbSetJournalNote=async(uid,id,data)=>{assert.equal(uid,'free-pilgrim');saved=data;};
  await state.saveJournalNote(1);assert.equal(saved.text,'A private memory');
  state.window._fbGetJournalNote=async()=>({exists:true,data:()=>saved});
  elements['journal-input-1'].value='';await state.loadJournalNote(1);
  assert.equal(elements['journal-input-1'].value,'A private memory');
  state.window._currentUser=null; saved=null; await state.saveJournalNote(1);assert.equal(saved,null);
});
test('certificates still require real completed visits, never a payment',()=>{
  const {state}=app();const required=state.getCertificateSanctuaries('be');
  assert.ok(required.length>0);assert.equal(state.isCertificateUnlocked('be'),false);
  required.forEach(s=>state.visits[s.id]='2026-10-19');assert.equal(state.isCertificateUnlocked('be'),true);
});
test('web and Android contain no path that can start or verify a purchase',()=>{
  assert.doesNotMatch(html,/buy\.stripe\.com|purchasePremium|restorePremium|httpsCallable|firebase-functions-compat|PREMIUM_PRICE_EUR|handleRegionPurchase/);
  assert.doesNotMatch(fs.readFileSync(path.join(root,'android/app/build.gradle'),'utf8'),/billingclient/);
  assert.doesNotMatch(fs.readFileSync(path.join(root,'android/app/src/main/java/com/peregrin/app/MainActivity.java'),'utf8'),/PeregrinBilling/);
});
test('free access preserves account data loading without writing paid flags',()=>{
  const loader=html.slice(html.indexOf('window._loadUserData ='),html.indexOf('async function saveVisits'));
  assert.match(loader,/visits=d\.visits/);assert.match(loader,/pilgrimName=d\.displayName/);
  assert.doesNotMatch(loader,/_fbSetDoc|isPremium:true/);
});
test('the first suggested step opens an existing screen',()=>{
  const state={getVisitCount:()=>0,t:key=>key};vm.createContext(state);
  vm.runInContext(source('getHomeInsight'),state);
  const destination=state.getHomeInsight().action.match(/^switchScreen\('([^']+)'\)$/)[1];
  assert.ok(html.includes('id="screen-'+destination+'"'));
  assert.equal(destination,'explore');
});
test('web and Android package exactly the same app, translations and privacy notice',()=>{
  for(const file of ['index.html','sw.js','route-guides.js','privacy.html','content-packs/africa.js','content-packs/oceania.js','content-packs/philippines.js']){
    const expected=fs.readFileSync(path.join(root,file),'utf8');
    assert.equal(fs.readFileSync(path.join(root,'www',file),'utf8'),expected);
    assert.equal(fs.readFileSync(path.join(root,'android/app/src/main/assets/public',file),'utf8'),expected);
  }
});
test('all scripts parse and offline cache references exist',()=>{
  for(const match of html.matchAll(/<script(?:\s[^>]*)?>([^]*?)<\/script>/g))new vm.Script(match[1]);
  for(const file of ['sw.js','app-data.js','route-guides.js','share-cards.js','certificates.js',...fs.readdirSync(path.join(root,'content-packs')).filter(f=>f.endsWith('.js')).map(f=>'content-packs/'+f)])new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
  const worker=fs.readFileSync(path.join(root,'sw.js'),'utf8');
  for(const m of worker.matchAll(/appPath\('([^']+)'\)/g))assert.ok(fs.existsSync(path.join(root,'www',m[1])),m[1]);
  assert.ok(html.includes('sw.js?v='+worker.match(/peregrin-v(\d+)/)[1]));
});
