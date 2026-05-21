# Payment incident runbook

Last updated: 2026-05-21

Use this when a real user says: "I paid and I still do not have Premium."

## Immediate priority

Do not make the user wait while debugging. If the user appears to have paid, give
them the emergency Premium code first:

```text
PEREGRIN-388066-6291
```

In the app they can open the Premium modal and choose:

```text
Tengo un codigo Premium
```

Then they enter the code. If their app language is not Spanish, the same button is
translated as "Use premium code", "J'ai un code Premium", "Ho un codice Premium",
or "Tenho um codigo Premium".

## Ask for these details

- Platform: Android app or web.
- Approximate payment time and timezone.
- Email used in Peregrin.
- Email used for Google Play or Stripe, if different.
- Screenshot or receipt/order ID if they have it.
- Whether they are on version `1.0.30` or later on Android.

Do not ask for full card data, passwords, Stripe secret values, or Google account
passwords.

## Android triage

For Android users:

- Ask them to update Peregrin from Google Play.
- Ask them to sign in inside the app.
- Ask them to open Premium and tap "Restaurar compra".
- If that still fails, give the emergency code.

Then check logs:

```powershell
npx.cmd firebase functions:log --only verifyGooglePlayPurchase --project peregrin-d7611 -n 100
```

Important log clues:

```text
google_play_purchase_lookup_failed
403
failed-precondition
already-exists
unauthenticated
```

Known context from 2026-05-21:

- Several failures showed `google_play_purchase_lookup_failed` with `403`.
- Play Console visually showed the service account as active with administrator
  permissions for `com.peregrin.app`.
- Version `1.0.30` added restore and emergency fallback after Google Play returns a
  paid purchase token.

## Web triage

For web users:

- If they returned from Stripe to the app successfully, the app should try to
  unlock internally through the emergency code.
- If they closed the browser, changed device, lost the return session, or the
  return URL did not complete, give the emergency code.
- Do not promise automatic email unless the live Stripe webhook plus SMTP settings
  have been verified.

Check whether the user paid through the current Stripe Payment Link:

```text
https://buy.stripe.com/bJeeVfbotaZBaVZgSofEk01
```

## Firestore check

The user is Premium if their user document has:

```text
isPremium: true
unlockedRegions: ["all"]
```

Premium code unlocks should use:

```text
premiumSource: "code"
premiumCode: "PEREGRIN-388066-6291"
```

## Escalation rules

Escalate as a production incident if any of these happen:

- More than one paid user reports being blocked in the same day.
- Firebase logs show repeated `403` after version `1.0.30` is live.
- Google Play returns successful purchases but Firestore updates fail.
- Stripe payments succeed but neither return unlock nor manual code works.

In an incident, stop feature work. Fix payment/support first.

## Support message template

```text
Hola, siento muchisimo el problema. Si el pago ya se ha realizado, no quiero que
te quedes esperando: abre Peregrin, entra en Premium, pulsa "Tengo un codigo
Premium" e introduce este codigo:

PEREGRIN-388066-6291

Con eso Premium deberia quedar activado. Si no se activa, respondeme con una
captura del recibo o el numero de pedido y lo reviso personalmente.
```

