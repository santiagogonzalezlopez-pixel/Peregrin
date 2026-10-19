const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const translations = html.slice(html.indexOf('const i18n ='), html.indexOf('// Local developer premium access.'));

function functionSource(name) {
  const match = html.match(new RegExp('^(?:async )?function '+name+'\\([^]*?^}', 'm'));
  assert.ok(match, 'Missing application function: '+name);
  return match[0];
}

function app(overrides = {}) {
  const elements = {
    'premium-card-content': {innerHTML:''},
    'premium-modal': {classList:{add(){}}},
    'premium-checkout-price': {textContent:'', isConnected:true}
  };
  const state = {
    console:{warn(){}, error(){}}, URLSearchParams, Intl, Set,
    window:{location:{href:''}, _currentUser:{uid:'test-user', email:'pilgrim@example.test'}},
    currentLang:'es', currentScreen:'home', GOOGLE_PLAY_PRODUCT_ID:'peregrin_premium_all',
    PREMIUM_CHECKOUT_ENABLED:true, STRIPE_PAYMENT_LINK:'https://buy.stripe.com/00w8wR9glaZB2pt31yfEk02',
    PAYMENT_INTENT_FLAG:'test-checkout', sessionStorage:{setItem(){}},
    document:{getElementById:id=>elements[id]},
    isNativeAppRuntime:()=>false, canUseGooglePlayBilling:()=>false,
    getGooglePlayBillingPlugin:()=>null, canOfferPremiumCheckout:()=>true,
    hasFullPremiumAccess:()=>false, areAllRegionsUnlocked:()=>false,
    canUseTesterAccess:()=>false, hasTesterAccess:()=>false,
    trackEvent(){}, showToast(){}, closePremiumModal(){},
    restoreGooglePlayPremium:async()=>false,
    ...overrides
  };
  vm.createContext(state);
  vm.runInContext(translations, state);
  for (const name of ['openPremiumModal', 'updateGooglePlayPrice', 'handleRegionPurchase',
    'googlePlayPurchasePayload', 'isBillingCancelled', 'verifyGooglePlayPremium',
    'handleGooglePlayVerificationFailure', 'handleGooglePlayPurchase']) {
    vm.runInContext(functionSource(name), state);
  }
  return {state, elements};
}

test('all five languages and regional entry points advertise a single euro', () => {
  const {state, elements} = app();
  for (const lang of ['en','es','fr','it','pt']) {
    state.currentLang = lang;
    for (const region of ['Europe','Americas','Asia','All']) {
      const price = state.t('premiumPrice'+region);
      assert.match(price, /1/);
      assert.match(price, /€/);
      assert.doesNotMatch(price, /2[.,]99/);
      assert.equal(price.replace(/[^\d]/g, ''), '1');
    }
    state.openPremiumModal();
    assert.ok(elements['premium-card-content'].innerHTML.includes(state.t('premiumPriceAll')));
  }
  assert.equal(state.formatPremiumPrice('unsupported'), state.formatPremiumPrice('en'));
});

test('Android uses the store price, including its local currency', async () => {
  const {state, elements} = app({isNativeAppRuntime:()=>true,
    getGooglePlayBillingPlugin:()=>({getPremiumPrice:async()=>({productId:'peregrin_premium_all', formattedPrice:'₱60.00'})})});
  state.openPremiumModal();
  assert.doesNotMatch(elements['premium-card-content'].innerHTML, / — 1\s*€/);
  await state.updateGooglePlayPrice();
  assert.equal(elements['premium-checkout-price'].textContent, ' — ₱60.00');
});

test('failed, wrong-product and stale price responses never advertise a guessed price', async () => {
  for (const lookup of [async()=>{throw new Error('offline');}, async()=>({productId:'other', formattedPrice:'€99'})]) {
    const {state, elements} = app({getGooglePlayBillingPlugin:()=>({getPremiumPrice:lookup})});
    await state.updateGooglePlayPrice();
    assert.equal(elements['premium-checkout-price'].textContent, '');
  }
  const {state, elements} = app({getGooglePlayBillingPlugin:()=>({getPremiumPrice:async()=>({productId:'peregrin_premium_all', formattedPrice:'€1'})})});
  elements['premium-checkout-price'].isConnected = false;
  await state.updateGooglePlayPrice();
  assert.equal(elements['premium-checkout-price'].textContent, '');
});

test('existing Premium users are not offered another purchase', () => {
  const {state, elements} = app({hasFullPremiumAccess:()=>true});
  state.openPremiumModal();
  assert.doesNotMatch(elements['premium-card-content'].innerHTML, /handleRegionPurchase/);
  assert.ok(elements['premium-card-content'].innerHTML.includes(state.t('premiumAlreadyUnlocked')));
});

test('web checkout preserves account, language and return context', async () => {
  let saved;
  const {state} = app({sessionStorage:{setItem:(key,value)=>{saved=JSON.parse(value);}}});
  await state.handleRegionPurchase('all');
  const url = new URL(state.window.location.href);
  assert.equal(url.origin, 'https://buy.stripe.com');
  assert.equal(url.searchParams.get('client_reference_id'), 'test-user');
  assert.equal(url.searchParams.get('prefilled_email'), 'pilgrim@example.test');
  assert.equal(url.searchParams.get('locale'), 'es');
  assert.equal(saved.uid, 'test-user');
  assert.equal(saved.region, 'all');
});

test('Android cannot fall through to Stripe when billing is unavailable', async () => {
  const {state} = app({isNativeAppRuntime:()=>true});
  await state.handleRegionPurchase('all');
  assert.equal(state.window.location.href, '');
});

test('Google Play checkout activates only after successful server verification', async () => {
  let verified = 0, loaded = 0, closed = 0;
  const {state} = app({
    window:{_currentUser:{uid:'test-user'}, _fbVerifyGooglePlayPurchase:async payload=>{
      assert.equal(payload.productId, 'peregrin_premium_all'); verified++;
      return {data:{success:true}};
    }, _loadUserData:async()=>{loaded++;}},
    getGooglePlayBillingPlugin:()=>({purchasePremium:async()=>({success:true, purchaseToken:'test-token'})}),
    closePremiumModal:()=>{closed++;}
  });
  await state.handleGooglePlayPurchase('all');
  assert.equal(verified, 1);
  assert.equal(loaded, 1);
  assert.equal(closed, 1);
});

test('cancelled and unverified purchases never report Premium activation', async () => {
  for (const cancelled of [true, false]) {
    let closed = 0;
    const events = [];
    const {state} = app({
      getGooglePlayBillingPlugin:()=>({purchasePremium:async()=>{
        if(cancelled) throw new Error('USER_CANCELED');
        return {success:true, purchaseToken:'test-token'};
      }}),
      closePremiumModal:()=>{closed++;}, trackEvent:name=>events.push(name)
    });
    await state.handleGooglePlayPurchase('all');
    assert.equal(closed, 0);
    assert.ok(!events.includes('premium_purchase_success'));
    assert.ok(events.includes(cancelled ? 'premium_purchase_cancelled' : 'premium_purchase_failed'));
  }
});

test('root, hosted web and packaged Android have identical price and cache files', () => {
  for (const file of ['index.html','sw.js']) {
    const expected = fs.readFileSync(path.join(root,file), 'utf8');
    assert.equal(fs.readFileSync(path.join(root,'www',file),'utf8'), expected);
    assert.equal(fs.readFileSync(path.join(root,'android/app/src/main/assets/public',file),'utf8'), expected);
  }
});

test('all app scripts parse and the offline shell has no missing local assets', () => {
  for (const match of html.matchAll(/<script(?:\s[^>]*)?>([^]*?)<\/script>/g)) new vm.Script(match[1]);
  for (const file of ['sw.js','app-data.js','route-guides.js','share-cards.js','certificates.js','functions/index.js',
    ...fs.readdirSync(path.join(root,'content-packs')).filter(f=>f.endsWith('.js')).map(f=>'content-packs/'+f)]) {
    new vm.Script(fs.readFileSync(path.join(root,file),'utf8'), {filename:file});
  }
  const worker = fs.readFileSync(path.join(root,'sw.js'),'utf8');
  for (const match of worker.matchAll(/appPath\('([^']+)'\)/g)) {
    assert.ok(fs.existsSync(path.join(root,'www',match[1])), 'Missing cached asset: '+match[1]);
  }
  const version = worker.match(/peregrin-v(\d+)/)[1];
  assert.ok(html.includes('sw.js?v='+version));
});
