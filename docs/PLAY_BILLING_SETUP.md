# Google Play Billing setup

Peregrin usa Google Play Billing dentro de la app Android y mantiene Stripe solo para la version web.

## Producto que debe existir en Play Console

- Tipo: one-time product / in-app product
- Product ID: `peregrin_premium_all`
- Nombre sugerido: `Peregrin Premium`
- Beneficio: desbloqueo permanente de todos los paises, guias Premium, diario privado, certificados y logros
- Precio: el que se decida en Play Console

## Flujo implementado

- Android llama al plugin nativo `PeregrinBilling`.
- La compra abre la pasarela oficial de Google Play.
- La app reconoce y guarda el desbloqueo Premium en Firestore.
- El modal Premium incluye restaurar compra si el usuario reinstala o cambia de dispositivo.
- Web/GitHub Pages sigue usando el enlace de Stripe.

## Nota de seguridad

La version actual reconoce la compra desde el cliente y guarda el token de Google Play en Firestore. Antes de escalar a muchos usuarios conviene endurecerlo con verificacion servidor a servidor mediante Google Play Developer API o Cloud Functions.
