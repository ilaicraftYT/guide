# Añadiendo tu bot a servidores

Si tu haz seguido las guias en anteriores paginas, ya deberias tener una aplicación de bot. Como sea, si no está en ningun servidor aún. Como esto funciona?

Antes de ver tu bot en tu propio (o ajeno) servidor, necesitas añadirlo creando y usando una invitación unica usando el ID de la aplicación.

## Enlaces de invitación

La versión básica del enlace luce algo así:

```
https://discord.com/oauth2/authorize?client_id=123456789012345678&scope=bot+applications.commands
```

The structure of the url is quite simple:

* La primera parte es solo la estructura estandar de Discord para actualizar una aplicación OAuth3 (como tu aplicación del bot) para entrar a un servidor de Discord.
* La segunda parte dice `client_id=...` es para especificar _cual_ aplicación quieres autorizar. Necesitaras remplazar esta parte con el ID del cliente para crear un enlace de invitación valido.
* Como ultimo, la tercera parte, la cual dice `scope=bot+application.commads`, especifica que quieres añadir la aplicación como un bot de Discord, con la habilidad de crear Slash Commands.


::: tip
El `permissions` parametro tambien existe para restringir o garantizar el permiso que tu bot va a tener en el servidor que lo estan añadiendo. Para facilidad de uso, es recomendado usar [esta](https://discordapi.com/permissions.html) página.
:::

::: Advertencia
Si obtienes un error diciendo "Bot requires a code grant", entonces ve a las configuraciones de tu aplicación y desabilita la "Require OAuth2 Code Grant" opción. Usted usualmente no habilitará esta "caja" si no sabe para que lo necesita.
:::

## Creando y usando el enlace de invitación

Como mencionamos arriba, necesitas remplazar el parametro `client_id` con el ID del cliente para generar el enlace de invitación. Para encontrar la ID de la aplicación, ve a la [My Apps](https://discord.com/developers/applications/me) página abajo de la sección "Applications" una vez más y clic en la aplicación de tu bot.

Inserta tu ID de la aplicación en el ejemplo, y entonces abre en enlace en el navegador. Deberias ver algo como esto (con el nombre y avatar del bot):

## Creating and using your invite link


![Página de autorización](./images/bot-auth-page.png)

Elige el servidor que quieras añadirlo y haz clic en "Authorize". Haz de cuenta que necesitas el permiso "Gestionar servidor" en el servidor que quieras añadir el bot. Esto debería entonces presentarte un buen mensaje de confirmación:


![Bot autorizado](./images/bot-authorized.png)

Felicidades! Haz añadido tu bot a tu servidor de Discord. Este debería mostrarse en la lista de miembros:

![Bot en la lista de miembros](./images/bot-in-memberlist.png)