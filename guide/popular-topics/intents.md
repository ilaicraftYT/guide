# Intents del Gateway

Los Intents del Gateway fueron introducidos por Discord para que los desarrolladores de bots puedan elegir los eventos que su bot recibirá, basándose en los datos que necesite para funcionar. Los Intents son grupos nombrados de eventos del WebSocket pre-definidos, los cuales el cliente de discord.js recibirá. Si omites el Intent `DIRECT_MESSAGE_TYPING` por ejemplo, no recibirás eventos cuando un usuario empieza a escribir en mensaje directo. Si no provess ningún intent, discord.js arrojará un error.

## Intents privilegiados

Discord define algunos Intents como "privilegiados" debido a los datos que ofrecen. Por ahora, los Intents privilegiados son `GUILD_PRESENCES` y `GUILD_MEMBERS`. Si tu bot no está verificado y está en menos de 100 servidores, puedes habilitar los Intents del Gateway privilegiados en el [Portal de Desarrolladores de Discord](https://discord.com/developers/applications) debajo de "Privileged Gateway Intents" en la sección "Bot". Si tu bot ya está verificado o está a punto de [pedir la verificación](https://support.discord.com/hc/en-us/articles/360040720412), tendrás que pedir los Intents privilegiados. Puedes hacer esto en tu formulario de verificación o hablando con el [equipo de soporte](https://dis.gd/contact) de Discord, incluyendo la razón por la cual quieres acceso a cada Intent privilegiado.

Antes de hacerlo, detente y piensa cuidadosamente sobre si realmente necesitas estos eventos. Discord los ha hecho opcionales para que todos los usuarios a través de la plataforma puedan disfrutar de un mayor nivel de seguridad. Las presencias pueden exponer bastante información personal a través de juegos y tiempos en línea, por ejemplo. Puede que sea suficiente para tu bot tener un poco menos de información sobre todos los miembros del servidor en todo momento, teniendo en cuenta que aún puedes obtener el autor del comando como el `GuildMember` del mensaje de ejecución, y puedes buscar miembros por separado.

### Error: Intents deshabiltados

Si recibes un error que empieza con `[DISALLOWED_INTENTS]`, revisa los ajustes del panel de desarrolladores para ver todos los Intents privilegiados que tengas activados. Revisa la [documentación de la API de Discord](https://discord.com/developers/docs/topics/gateway#privileged-intents) para información más detallada.

## Activando Intents

Para especificar los eventos que quieres que tu bot reciba, primero piensa que eventos tu bot necesita operar. Entonces, selecciona los Intents que necesites y añádelos a tu constructor Client, como puedes ver abajo.

Todos los Intents del Gateway y eventos pertenecientes a estos, están listados en la [documentación de la API de Discord](https://discord.com/developers/docs/topics/gateway#list-of-intents). Si necesitas que tu bot reciba mensajes (`MESSAGE_CREATE` - `"messageCreate"` en discord.js), necesitarás el Intent `GUILD_MESSAGES`. Si quieres que to bot anuncie mensajes de bienvenidas para nuevos miembros (`GUILD_MEMBER_ADD` - `"guildMemberAdd"` en discord.js), necesitarás el Intent `GUILD_MEMBERS`, y así sucesivamente.

```js
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
```

::: warning
Ten en cuenta que discord.js se basa en gran medida en el almacenamiento en caché para proporcionar su funcionalidad. Algunos métodos que parecen no estar relacionados, podrían dejar de funcionar si no se emiten ciertos eventos.

~~Asegúrate de proporcionar una lista de los `Intents del Gateway` y `Partials` que usas en tu constructor Client cuando pidas soporte en el [Servidor de Discord](https://discord.gg/djs) o en el [repositorio de GitHub](https://github.com/discordjs/discord.js)`~~
:::

## Los Bitfields de Intents

Discord.js proporciona la estructura de utilidad <DocsLink section="main" path="class/Intents">`Intents`</DocsLink> para simplificar la modificación de bitfields de los Intents.

Puedes usar los métodos `.add()` y `.remove()` para añadir o eliminar flags (String de Intents representando un cierto bit) y modificar el Bitfield. Puedes proporcionar una sola flag así como un array de flags o Bitfield. Para usar conjunto de Intents como plantilla, puedes pasarlos por el constructor. Un constructor `new Intents()` vacío crea una nueva instancia de Intents vacíos, representando ningún Intent o el bitfield `0`:

```js {3,4,6,10,11,13,14}
const { Client, Intents } = require('discord.js');

const myIntents = new Intents();
myIntents.add(Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS);

const client = new Client({ intents: myIntents });

// otros ejemplos:

const otherIntents = new Intents([Intents.FLAGS.GUILDS, Intents.FLAGS.DIRECT_MESSAGES]);
otherIntents.remove([Intents.FLAGS.DIRECT_MESSAGES]);

const otherIntents2 = new Intents(32509);
otherIntents2.remove(4096, 512);
```

Si quieres ver las flags construidas, puedes usar los métodos `.toArray()` o `.serialize()`. El primero devuelve un array de flags representado en los Bitfields y el segundo devuelve un objeto mapeando todos los valores de los flags a un booleano, basándose en su representación en este Bitfield.

## Más de Bitfields

Los Intents y permisos de Discord son almacenados en un integer de 53-bits y calculados usando operadores de desplazamiento de bits (Bitwise operators). Si quieres navegar más profundo sobre qué sucede detrás de las cortinas, puedes revisar los artículos de [MDN](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators#operadores_de_desplazamiento_de_bits) sobre el tópico.

En discord.js, los bitfields de `Permissions` y `Intents` se representan como el valor decimal de dicho bitfield o sus flags referenciadas. Cada posición de un bitfield de permisos representa uno de estas bitfields y su estado. (Ya sea `1` para referenciado y `0` para no referenciado)