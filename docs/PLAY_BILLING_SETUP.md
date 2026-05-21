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
- Despues de conceder Premium, Firebase consume el producto para que pueda comprarse de nuevo con la misma cuenta de Google Play en otro perfil de Peregrin.
- El modal Premium no muestra restaurar compra; el Premium se recupera iniciando sesion con la misma cuenta de Peregrin.
- Web/GitHub Pages sigue usando el enlace de Stripe.
- El codigo Premium manual sigue disponible como respaldo.

## Firebase / Google Play API

- Proyecto Firebase: `peregrin-d7611`
- Funcion: `verifyGooglePlayPurchase`
- Region: `europe-west1`
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
firebase deploy --only functions:verifyGooglePlayPurchase,firestore:rules --project peregrin-d7611
```

No uses `firebase deploy --only functions` desde este repo mientras las funciones de Stripe (`createCheckoutSession`, `stripeWebhook`) no esten tambien en el directorio `functions/`.

## Seguridad

Las reglas de Firestore ya no aceptan desbloqueos de Google Play escritos directamente por el cliente. Solo se mantiene el codigo Premium manual como respaldo controlado con la coleccion `premiumCodes`.

La app no guarda el purchase token completo en `users`; guarda un hash servidor. El token completo solo se usa dentro de la Cloud Function para consultar Google Play.
