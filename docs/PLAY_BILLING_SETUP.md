# Google Play Billing setup

Peregrin usa Google Play Billing dentro de la app Android y mantiene Stripe solo para la version web.

## Producto que debe existir en Play Console

- Tipo: one-time product / in-app product
- Product ID: `peregrin_premium_all`
- Nombre sugerido: `Peregrin Premium`
- Beneficio: desbloqueo permanente de todos los paises, guias Premium, diario privado, certificados y logros
- Precio actual previsto: `2,99 €` (tambien debe configurarse manualmente en Play Console)

## Activacion en codigo

La compra Android esta activada en `index.html` para produccion:

```js
const GOOGLE_PLAY_CHECKOUT_ENABLED = true;
```

Antes de enviar el AAB a revision, confirma en Play Console que el producto `peregrin_premium_all` existe, esta activo y tiene precio configurado.

## Flujo implementado

- Android llama al plugin nativo `PeregrinBilling`.
- La compra abre la pasarela oficial de Google Play.
- La app envia el purchase token a Firebase Cloud Functions.
- La funcion `verifyGooglePlayPurchase` valida el token con Google Play Developer API.
- Si Google confirma la compra, Firebase marca Premium en Firestore desde servidor.
- Si Google Play ya cobro pero la verificacion servidor falla por configuracion/API, la app desbloquea con el codigo de emergencia para no dejar al usuario pagado bloqueado.
- Despues de conceder Premium, Firebase consume el producto para que pueda comprarse de nuevo con la misma cuenta de Google Play en otro perfil de Peregrin.
- El modal Premium muestra restaurar compra en Android y tambien intenta recuperar compras automaticamente al iniciar sesion.
- Web/GitHub Pages usa Stripe Payment Link `https://buy.stripe.com/bJeeVfbotaZBaVZgSofEk01` con precio `2,99 €`.
- El codigo Premium manual sigue disponible como respaldo.
- El retorno de Stripe iniciado desde la app desbloquea con el codigo de emergencia principal `PEREGRIN-388066-6291`.
- El codigo de emergencia alternativo `PEREGRIN-PREMIUM-2026` tambien se mantiene activo.
- El webhook `stripeWebhook` tambien desbloquea Premium desde servidor cuando recibe `checkout.session.completed` o `checkout.session.async_payment_succeeded` con `payment_status=paid`.
- Si `SMTP_URL` esta configurado en Cloud Functions, el webhook envia al comprador un email con el codigo de emergencia para cubrir cualquier caso en que la cuenta no pueda emparejarse automaticamente.

## Firebase / Google Play API

- Proyecto Firebase: `peregrin-d7611`
- Funcion: `verifyGooglePlayPurchase`
- Region: `europe-west1`
- Funcion Stripe: `stripeWebhook`
- Region Stripe: `us-central1`
- App Android: `com.peregrin.app`
- Producto: `peregrin_premium_all`

La funcion usa credenciales de servidor del proyecto Firebase. En Play Console hace falta que la cuenta de servicio de la funcion tenga acceso a la Google Play Developer API para esta app.

Cuenta de servicio probable en Cloud Functions gen 2:

```text
844223897807-compute@developer.gserviceaccount.com
```

Si Play Console pide enlazar o autorizar el proyecto, entra en:

```text
Play Console -> Configuracion -> Acceso a la API
```

Y concede a esa cuenta de servicio acceso a la app Peregrin con permisos para consultar/gestionar compras o pedidos.

Para desplegar desde este repo, usa solo:

```bash
firebase deploy --only functions:verifyGooglePlayPurchase,functions:stripeWebhook,firestore:rules --project peregrin-d7611
```

Configura en Stripe un webhook hacia la URL de `stripeWebhook` con estos eventos:

```text
checkout.session.completed
checkout.session.async_payment_succeeded
```

Y define estas variables de entorno en Cloud Functions antes del despliegue:

```text
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SECRET_KEY=sk_live_...
PREMIUM_FALLBACK_CODES=PEREGRIN-388066-6291,PEREGRIN-PREMIUM-2026
SMTP_URL=smtp://usuario:password@host:puerto
SMTP_FROM="Peregrin" <elnuevoeuropeo@gmail.com>
```

`SMTP_URL` y `SMTP_FROM` son opcionales para el desbloqueo automatico, pero necesarios para enviar el email con el codigo.

## Seguridad

Las reglas de Firestore ya no aceptan desbloqueos de Google Play escritos directamente por el cliente. Se mantiene el codigo Premium manual como respaldo controlado con la coleccion `premiumCodes`, mas los codigos de emergencia `PEREGRIN-388066-6291` y `PEREGRIN-PREMIUM-2026` para pagos reales que necesiten rescate inmediato.

La app no guarda el purchase token completo en `users`; guarda un hash servidor. El token completo solo se usa dentro de la Cloud Function para consultar Google Play.
