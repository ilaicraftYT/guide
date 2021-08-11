# Actualizando de v12 a v13

## Antes de que empieces

Discord.js v13 necesita Node.js 16.6 como mínimo para que funcione, así que asegúrate de tener la versión correcta. Para ver la version de Node en tu host usa `node -v` en tu terminal, si es inferior a 16.6 significa que debes actualizar antes de empezar.

Una vez tengas Node actualizado, podrás instalar discord.js v13 usando `npm install discord.js` en tu terminal (`npm install discord.js @discordjs/voice` para soporte de voz).

Puedes verificar tu version de discord.js usando `npm list discord.js`. Si sigue en v12.x, desinstalalo (`npm uninstall discord.js`) y reinstalalo (`npm install discord.js`).

## Versión del API

Discord.js v13 usa la versión 9 del API de Discord. Adicionalmente, la nueva versión incluye muchas funciones nuevas.

## Slash commands

¡Discord.js tiene soporte para slash commands!
Visita la seccion de [slash commands](/interactions/registering-slash-commands.html) para empezar a usarlos.

La guía explica el evento `interactionCreate`. En esta versión también existen los eventos `applicationCommandCreate`, `applicationCommandDelete`, and `applicationCommandUpdate`.

## Componentes

¡Discord.js tiene soporte para componentes!
Se han introducido las clases`MessageActionRow`, `MessageButton` y `MessageSelectMenu`, al igual que las interacciones y colectores asociados a estos. 

Revisa la seccion de [componentes](/interactions/buttons.html) en esta guía para empezar a usarlos.

## Hilos (threads)

¡Discord.js tiene soporte para threads! Los threads son un nuevo tipo de sub canal que pueden ser usados para separar conversaciones.

Esto introduce la clase `ThreadManager`, la cual puede ser encontrada como `TextChannel#threads`, en adición a `ThreadChannel`, `ThreadMemberManager`, y `ThreadMember`. También hay cinco eventos nuevos: `threadCreate`, `threadDelete`, `threadListSync`, `threadMemberUpdate` y `threadMembersUpdate`.

Revisa la seccion de [threads](/popular-topics/threads.html) en esta guía para empezar a usarlos.

## Voz

El soporte para voz ha sido separado a un nuevo módulo. Ahora tienes que instalar [@discordjs/voice](https://github.com/discordjs/voice) para interactuar con el API de voz de Discord.

Revisa la sección de [Voz](/voice/) en esta guía para empezar a usarlos.

## Nuevo administrador de caché

Una solicitud muy popular ha sido escuchada: La clase `Client` ahora tiene una nueva opción, `makeCache`. El argumento que recibe es un `CacheFactory`.

Combinandolo con el método `Options.cacheWithLimits` puedes definir los limites de caché para cada Manager y discord.js se encargará del resto.

```js
const client = new Client({
	makeCache: Options.cacheWithLimits({
		MessageManager: 200, // Por defecto
		PresenceManager: 0,
		// Añadir más clases aquí
	}),
});
```

Se puede conseguir más flexibilidad declarando una función que retorna una implementación de caché personalizada. Ten en cuenta que debe mantener una interfaz parecida a `Collection`/`Map` para mantener compatibilidad interna.

```js
const client = new Client({
	makeCache: manager => {
		if (manager.name === 'MessageManager') return new LimitedCollection({ maxSize: 0 });
		return new Collection();
	},
});
```

## Métodos usados comúnmente que han cambiado

### Enviando mensajes, embeds, archivos, etc.

Con la introducción de las interacciones y el hecho de que es muy común que los usuarios quieran enviar embeds con MessageOptions, los métodos que envían mensajes ahora imponen un único parámetro.

Este puede ser entre un string, un `MessagePayload`, o la variante de `MessageOptions` de ese método.

Adicionalmente, todos los mensajes enviados por bots ahora soportan hasta 10 embeds. Como resultado de esto, la opción `embed` ha sido removida y reemplazada con `embeds`, la cual toma como valor un array de objetos de embeds.

```diff
- channel.send(embed);
+ channel.send({ embeds: [embed, embed2] });

- channel.send('¡Hola!', { embed });
+ channel.send({ content: '¡Hola!', embeds: [embed, embed2] });

- interaction.reply('¡Hola!', { ephemeral: true });
+ interaction.reply({ content: '¡Hola!', ephemeral: true });
```

`MessageEmbed#attachFiles` ha sido removido; los archivos ahora deberán ser adjuntados directamente al mensaje en lugar de al embed.

```diff
- const embed = new Discord.MessageEmbed().setTitle('Archivos adjuntos').attachFiles(['./imagen1.png', './imagen2.jpg']);
- channel.send(embed);
+ const embed = new Discord.MessageEmbed().setTitle('Archivos adjuntos');
+ channel.send({ embeds: [embed], files: ['./imagen1.png', './imagen2.jpg'] });
```

Las opciones `code` y `split` también han sido removidas. Esta funcionalidad ahora tendrá que ser gestionada manualmente, vía los ayudantes `Formatters.codeBlock` y `Util.splitMessage`.

### Cadenas de Texto

Muchos métodos en discord.js que se documentaron aceptando cadenas de texto, también aceptaban otros tipos y se resolvia como string. Los resultados de este comportamiento eran a menudo indeseables, produciendo resultados como `[object Object]`.

Discord.js ahora aplica y valida la entrada de cadenas de texto en todos los metodos que la esperan. Los usuarios necesitaran llamar manualmente a `.toString()`  o utilizar `template string` para todas las entradas de cadenas de texto segun correspondan.

Las áreas más comunes donde se encuentran este cambio se aplica son: `MessageOptions#content`, las propiedades de un `MessageEmbed`, y pasando objetos como usuarios o roles, esperando que sean string.

```diff
- message.channel.send(user);
+ message.channel.send(user.toString());

let count = 5;
- embed.addField('Cantidad', count);
+ embed.addField('Cantidad', count.toString());
```

### Intents

Discord.js v13 hace el cambio a Discord API v9, ahora es **obligatorio** especificar todos los intents que usa su bot en el constructor Client. La opción `intents` también se ha movido de `ClientOptions#ws#intents` a `ClientOptions#intents`.

Los atajos `Intents.ALL`, `Intents.NON_PRIVILEGED`, y `Intents.PRIVILEGED` han sido removidos para evitar que el usuario establezca intents innecesarios.

Consulte nuestro [artículo más detallado sobre el tema](/popular-topics/intents.html).

```diff
- const client = new Client({ ws: { intents: [Intents.FLAGS.GUILDS] });
+ const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
```

### Structures#extend

El concepto de estructuras extendibles ha sido removido completamente de discord.js.
Para más información sobre el por qué de esta decisión, puedes ver [este pull request](https://github.com/discordjs/discord.js/pull/6027).

No hay ningún reemplazo para esto, ya que su intención es cambiar el diseño del código, en lugar de activar algo igualmente malo.

Para algún ejemplo del mundo real de las alternativas proporcionadas en el pull request, podrías haber estado extendiendo la clase `Guild` con ajustes específicos de la guild:

```js
Structures.extend('Guild', Guild => {
	return class MyGuild extends Guild {
		constructor(client, data) {
			super(client, data);
			this.settings = {
				prefix: '!',
			};
		}
	};
});
```

Esta funcionalidad puede ser replicada añadiendo `WeakMap` o `Collection` al cliente si es necesario:

```js
client.guildSettings = new Collection();
client.guildSettings.set(guildId, { prefix: '!' });
// En práctica, rellenarías esta Collection con datos obtenidos de una base de datos

const { prefix } = message.client.guildSettings.get(message.guild.id);
```

### Collectors

Todas las clases y métodos relacionados con `Collector` (tanto `.create()` y `.await()`) ahora tomaran un único parámetro de objeto que también incluye el filtro.

```diff
- const collector = message.createReactionCollector(filter, { time: 15000 });
+ const collector = message.createReactionCollector({ filter, time: 15000 });

- const reactions = await message.awaitReactions(filter, { time: 15000 });
+ const reactions = await message.awaitReactions({ filter, time: 15000 });
```

### Conveniencia de nombres

Algunas de las nomenclaturas de uso común en discord.js han cambiado

#### Algo#algoId

El nombre de las propiedades con el formato `thingID` han cambiado a `thingId`. Discord.js ahora usa (camelCase o 'letra de caja camello')[https://es.wikipedia.org/wiki/Camel_case] ya que `Id` es una abreviación de 'identificador', no un acrónimo.

Esto incluye: `afkChannelId`, `applicationId`, `channelId`, `creatorId`, `guildId`, `lastMessageId`, `ownerId`, `parentId`, `partyId`, `processId`, `publicUpdatesChannelId`, `resolveId`, `rulesChannelId`, `sessionId`, `shardId`, `systemChannelId`, `webhookId`, `widgetChannelId` y `workerId`.

```diff
- console.log(guild.ownerID);
+ console.log(guild.ownerId);

- console.log(interaction.channelID);
+ console.log(interaction.channelId);
```

#### Client#message

El evento `message` ha sido renombrado a `messageCreate` para alinear la libreria con las nomenclaturas de Discord.
El uso de `message` seguira funcionando, pero recibirás una advertencia de desuso hasta que cambies.

```diff
- client.on("message", message => { ... });
+ client.on("messageCreate", message => { ... });
```

### Snowflakes

Para usuarios de TypeScript, discord.js ahora impone el tipo `Snowflake`, un BigInt encadenado, en lugar de permitir que se acepte cualquier cadena.

```diff
interface Config {
 	prefix: string;
-	ownerId: string;
+	ownerId: Snowflake;
}
```

### Allowed Mentions

¡`clientOptions#disableMentions` ha sido removido y reemplazado por `clientOptions#allowedMentions`!
La API de Discord ahora le permite a los bots un control mucho más granular sobre el análisis de menciones.

Si quieres saber más sobre esto, mira la [documentación de la API de Discord](https://discord.com/developers/docs/resources/channel#allowed-mentions-object).

```diff
- const client = new Discord.Client({ disableMentions: 'everyone' });
+ const client = new Discord.Client({ allowedMentions: { parse: ['users', 'roles'], repliedUser: true } });
```

### Respuestas / Message#reply

El comportamiento de `Message#reply` ha cambiado: en vez de agregar una mención al usuario, usará la función de respuesta de Discord.

`MessageOptions#reply` ahora espera un objeto de tipo `ReplyOptions`. `MessageOptions#reply#messageReference` recibe el id del mensaje.

```diff
- channel.send('content', { reply: '123456789012345678' }); // User id
+ channel.send({ content: 'content', reply: { messageReference: '765432109876543219' }}); // Message id
```

La opción `MessageOptions.allowedMentions.repliedUser` determina si la respuesta notifica al autor del mensaje original.

```diff
- message.reply('content')
+ message.reply({ content: 'content', allowedMentions: { repliedUser: false }})
```
Tenga en cuenta que esto deshabilitará todas las demás menciones en este mensaje. Para habilitar otras menciones, necesitará incluir otros campones en `allowedMentions`. Consulte la sección `Allowed Mentions` para obtener mas infomación.

### Bitfields / Permisos

Los Bitfields ahora son `BigInt`s en lugar de `Number`s. Esto puede ser gestionado usando la clase `BigInt()`, o agregando la `n` de sufijo. Para más información sobre `BigInt`s, revisa la [documentación](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt).

```diff
- const p = new Permissions(104324673);
+ const p = new Permissions(BigInt(104324673));
+ const p = new Permissions(104324673n);
```
Evita usar strings como `Permissions` y `UserFlags`, hay flags en su lugar.

```diff
- permissions.has('SEND_MESSAGES')
+ permissions.has(Permissions.FLAGS.SEND_MESSAGES)
```

### Canales de MD

En la API de Discord v8 y superior, los canales de MD no emiten el evento `CHANNEL_CREATE`, lo que significa que discord.js no puede añadirlos en caché automáticamente. Para que tu bot pueda recibir DMs debes activar el [partial](/popular-topics/partials.html) `CHANNEL`.

### Webpack

Las builds de Webpack han sido descontinuados, ya no hay, no existen.

## Cambios y eliminaciones

### APIMessage

La clase `APIMessage` ha sido renombrada a `MessagePayload`, resolviendo un conflicto de nombres con una interfaz en la librería `discord-api-types` que representa el objeto de un mensaje crudo.

### Channel

#### Channel#type

Los tipos de canales ahora son en mayúsculas y se alinean con las convenciones de nombres de Discord.

```diff
- if(channel.type === 'text') channel.send('Contenido');
+ if(channel.type === 'GUILD_TEXT') channel.send('Contenido');
```

### Client

#### Client#emojis

El administrador de emojis del cliente ahora es un `BaseGuildEmojiManager`, que solo proprociona resolución de caché y elimina métodos que no podian crear emojis ya que no habia contexto de `guild`.

#### Client#fetchApplication

El método `Client#fetchApplication` ha sido removido y reemplazado con la propiedad `Client#application`.

```diff
- client.fetchApplication().then(application => console.log(application.name))
+ console.log(client.application.name);
```

#### Client#fetchWidget

Este método ha sido renombrado a `fetchGuildWidget` para representar mejor su funcionalidad.

#### Client#generateInvite

`Client#generateInvite` ahora recibe `InviteGenerationOptions` en vez de  `PermissionsResolvable` como argumento. `InviteGenerationOptions` necesita al menos un scope, `bot` o `application commands`, para generar una URL de invitación válida.     

Para generar una invitación con permisos de `slash commands`:

```js
client.generateInvite({ scopes: ['applications.commands'] });
```

Tambien puedes definir los permisos necesarios:

```diff
- client.generateInvite([Permissions.FLAGS.SEND_MESSAGES]);
+ client.generateInvite({ scopes: ['bot'], permissions: [Permissions.FLAGS.SEND_MESSAGES] })
```

#### Client#login

Cuando tu token se reiniciaba por llegar al limite de 1000 logins en 1 dia, discord.js lo consideraba un ratelimit y esperaba a que pueda hacer login sin avisar al usuario. Ahora tira un `Error` si esto ocurre

#### Client#setInterval
#### Client#setTimeout
#### Client#setImmediate

setImmediate va con M oe
ah cierto es con M wtf
Te imaginas que no borremos esto y que llegue a la pagina web? estaria turbio
Le haria el dia a muchas personas *ahora dejemos que andremor lo vea en la web*

Los métodos `Client#setInterval`, `Client#setTimeout` y `Client#setImmediate` han sido removidos. Estos métodos existian para almacenar timeouts en caché de manera interna para que se eliminen una vez el cliente sea destruido.
Ya que ahora esos timers tiene el metodo `unref` en Node, esto no es necesario.

### ClientOptions

#### ClientOptions#fetchAllMembers

La opción `ClientOptions#fetchAllMembers` ha sido removida.

Con la introducción de los intents de gateway, la opción del Client `fetchAllMembers` puede fallar y causar significantes retrasos en el alistamiento del bot o causar un error de tiempo de espera agotado.
Como su propósito contradice las intenciones de Discord de reducir el scrapeo de datos de usuarios y de presencia, se ha eliminado.

#### ClientOptions#messageCacheMaxSize

La opción `ClientOptions#messageCacheMaxSize` ha sido removida. En su lugar, usa [`ClientOptions#makeCache`](#customizable-manager-caches) para personalizar la caché del `MessageManager`.

#### ClientOptions#messageEditHistoryMaxSize

La opción `ClientOptions#messageEditHistoryMaxSize` ha sido removida.

Para reducir el caché, discord.js no almacenará un historial de ediciones. Ahora tendrás que implementar esto por ti mismo si lo necesitas.

### ClientUser

#### ClientUser#setActivity

El método `ClientUser#setActivity` ya no devuelve una promesa.

#### ClientUser#setAFK

El método `ClientUser#setAFK` ya no devuelve una promesa.

#### ClientUser#setPresence

El método `ClientUser#setPresence` ya no devuelve una promesa.

`PresenceData#activity` fue reemplazado por `PresenceData#activities`, el cual ahora requiere un `Array<ActivitiesOptions>`.

```diff
- client.user.setPresence({ activity: { name: 'The Game' } });
+ client.user.setPresence({ activities: [{ name: 'The Game' }] });
```

#### ClientUser#setStatus

El método `ClientUser#setStatus` ya no devuelve una promesa.

### Collection

#### Collection#array()
#### Collection#keyArray()

Estos métodos existían para proporcionar acceso a un array en caché de valores y claves de `Collection` respectivamente, en el que se basaban internamente otros métodos de `Collection`.
Esos otros métodos han sido renombrados para dejar de depender del caché, así que esos arrays y esos métodos han sido removidos.

En su lugar podrías hacer un array esparciendo los iterators retornados por los métodos de la clase base Map:

```diff
- collection.array();
+ [...collection.values()];

- collection.keyArray();
+ [...collection.keys()];
```

### ColorResolvable

Los colores fueron actualizados para alinearse con los nuevos colores de Discord.

### Guild

#### Guild#addMember

Este método fue removido, su funcionalidad fue reemplazada por el nuevo `GuildMemberManager#add`.

```diff
- guild.addMember(user, { accessToken: token });
+ guild.members.add(user, { accessToken: token });
```

#### Guild#fetchBan
#### Guild#fetchBans

Estos métodos se han removido, con su funcionalidad remplazada por el nuevo `GuildBanManager`.

```diff
- guild.fetchBan(user);
+ guild.bans.fetch(user);

- guild.fetchBans();
+ guild.bans.fetch();
```

#### Guild#fetchInvites

Este método se ha removido, con su funcionalidad remplazada por el nuevo `GuildInviteManager`.

```diff
- guild.fetchInvites();
+ guild.invites.fetch();
```

#### Guild#fetchVanityCode

El método `Guild#fetchVanityCode` se ha removido.

```diff
- Guild.fetchVanityCode().then(code => console.log(`Vanity URL: https://discord.gg/${code}`));
+ Guild.fetchVanityData().then(res => console.log(`Vanity URL: https://discord.gg/${res.code} with ${res.uses} uses`));
```

#### Guild#fetchWidget

El método `Guild#fetchWidget()` ahora recupera los datos del widget para el gremio en vez de configurarlo. Ver `Client#fetchGuildWidget()`.
La funcionalidad original ha sido movida al nuevo método `Guild#fetchWidgetSettings()`

#### Guild#member

El método de ayuda/atajo `Guild#member()` se ha removido.

```diff
- guild.member(user);
+ guild.members.cache.get(user.id)
```

### Guild#mfaLevel

La propiedad `Guild#mfaLevel` ahora es una enumeración.

### Guild#nsfw

La propiedad `Guild#nsfw` ha sido removida, remplazada por `Guild#nsfwLevel`.


#### Guild#owner

La propiedad `Guild#owner` ha sido removida ya que no era confiable debido al almacenamiento en caché, remplazada por `Guild#fetchOwner`.

```diff
- console.log(guild.owner);
+ guild.fetchOwner().then(console.log);
```

#### Guild#setWidget

El método `Guild#setWidget()` ha sido renombrado a `Guild#setWidgetSettings()`.

#### Guild#voice

La propiedad `Guild#voice` ha sido removida, aún puedes usar `Guild#me#voice`.

```diff
- guild.voice
+ guild.me.voice
```

### GuildChannel

#### GuildChannel#createOverwrite

Este método ha sido removido. Su funcionalidad fue reemplazada por el nuevo `PermissionOverwriteManager`.

```diff
- channel.createOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.create(user, { VIEW_CHANNEL: false });
```

#### GuildChannel#createInvite
#### GuildChannel#fetchInvites

Estos métodos fueron removidos de `GuildChannel` y colocados únicamente en subclases para las cuales se puedan crear invitaciones. Estos son `TextChannel`, `NewsChannel`, `VoiceChannel`, `StageChannel`, y `StoreChannel`.

En estas subclases, el método ahora soporta opciones adicionales:

- `targetUser` para definir la invitación a unirse a un usuario de transmisión en particular
- `targetApplication` para definir la invitación a una actividad de Discord particular
- `targetType` define el tipo de objetivo para esta invitación; usuario o aplicación

#### GuildChannel#overwritePermissions

Estos métodos fueron removidos, con su funcionalidad reemplazada por el nuevo `PermissionOverwriteManager`.

```diff
- channel.overwritePermissions([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
+ channel.permissionOverwrites.set([{ id: user.id , allow: ['VIEW_CHANNEL'], deny: ['SEND_MESSAGES'] }]);
```

#### GuildChannel#permissionOverwrites

Este método ya no devuelve una `Collection` de `PermissionOverwrites`, en lugar de proporcionar acceso a la `PermissionOverwriteManager`.

#### GuildChannel#setTopic

El método `GuildChannel#setTopic` fue removido y puesto únicamente en subclases para las cuales se puedan establecer. Estas son `TextChannel`, `NewsChannel`, y `StageChannel`.

#### GuildChannel#updateOverwrite

Este método fue removido, con su funcionalidad reemplazada por el nuevo `PermissionOverwriteManager`.

```diff
- channel.updateOverwrite(user, { VIEW_CHANNEL: false });
+ channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
```

### GuildMember 

#### GuildMember#ban

`GuildMember#ban()` devolverá un `TypeError` cuando se proporciona un `String` en vez de un objeto de opciones.

```diff
- member.ban('Razón')
+ member.ban({ reason: 'Razón' })
```

#### GuildMember#hasPermission

El método auxiliar/acortador `GuildMember#hasPermission` fue removido.

```diff
- member.hasPermission(Permissions.FLAGS.SEND_MESSAGES);
+ member.permissions.has(Permissions.FLAGS.SEND_MESSAGES);
```

#### GuildMember#lastMessage

#### GuildMember#lastMessageId

Ninguna de estas propiedades fue proporcionada por Discord, sino que se basó en una caché de cliente potencialmente inexacta y fue eliminado.

#### GuildMember#presence

La propiedad `GuildMember#presence` ahora puede ser null, en lugar de una presencia sin conexión genérica, como cuando el intent `GUILD_PRESENCES` no está activado.

### GuildMemberManager

#### GuildMemberManager#ban

El método `GuildMemberManager#ban` devolverá un `TypeError` cuando se proporciona un `String` en vez de un objeto de opciones.

```diff
- guild.members.ban('123456789012345678', 'Razón')
+ guild.members.ban('123456789012345678', { reason: 'Razón' })
```

### Message / MessageManager

#### Message#delete

El método `Message.delete()` no aceptara ningún tipo de opción adicional, requiriendo que una eliminación programada deba ser ejecutada manualmente.

```diff
- message.delete({ timeout: 10000 });
+ setTimeout(() => message.delete(), 10000);
```

El parámetro `reason` ya no es usando en el API de Discord.

#### MessageManager#delete

El método `MessageManager.delete()` no aceptara ningún tipo de opción adicional, requiriendo que una eliminación programada deba ser ejecutada manualmente.

```diff
- channel.messages.delete('123456789012345678', { timeout: 10000 });
+ setTimeout(() => channel.messages.delete('123456789012345678'), 10000);
```

El parámetro `reason` ya no es usando en el API de Discord.

### MessageEmbed

#### MessageEmbed#attachFiles

El método `MessageEmbed#attachFiles` fue removido. En cambio, los archivos deben adjuntarse al mensaje directamente a través de `MessageOptions`.

```diff
- channel.send({ embeds: [new MessageEmbed().setTitle("Archivos").attachFiles(file)] })
+ channel.send({ embeds: [new MessageEmbed().setTitle("Archivos")], files: [file] })
```

### Permissions

#### Permissions#FLAGS.MANAGE_EMOJIS

`Permissions.FLAGS.MANAGE_EMOJIS` ahora es `Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS`.

### ReactionUserManager

#### ReactionUserManager#fetch

La opción `before` fue removida ya que no era compatible con la API.

### RoleManager

#### RoleManager#create

Las opciones pasadas a `RoleManager#create` ya no necesitan un objeto `data`.
Adicionalmente, `reason` es ahora parte de las opciones, no un segundo parámetro.

```diff
- guild.roles.create({ data: { name: "Nuevo rol" } }, "Creando un nuevo rol");
+ guild.roles.create({ name: "Nuevo rol", reason: "Creando un nuevo rol"})
```

#### RoleManager#fetch

El método `RoleManager#fetch()` ahora devuelve una `Collection` en vez de un `RoleManager` cuando es llamado sin parámetros.

### Shard

#### Shard#respawn

Las opciones para el método `Shard#respawn` son ahora un objeto en vez de varios parámetros.
En adición, el parámetro `spawnTimeout` fue renombrado a `timeout`.
Esto significa que el usuario ya no necesita escribir valores predeterminados para completar cada parámetro posicional.

```diff
- shard.respawn(500, 30000);
+ shard.respawn({ delay: 500, timeout: 30000 });
```

#### Shard#spawn

El parámetro `spawnTimeout` fue renombrado a `timeout`.

### ShardClientUtil

#### ShardClientUtil#broadcastEval

El método `ShardClientUtil#broadcastEval` ya no acepta un `String`, sino que espera una función.

```diff
- client.shard.broadcastEval('this.guilds.cache.size')
+ client.shard.broadcastEval(client => client.guilds.cache.size)
		.then(results => console.log(`${results.reduce((prev, val) => prev + val, 0)} guilds totales`))
		.catch(console.error);
```

#### ShardClientUtil#respawnAll

Las opciones para el método `ShardClientUtil#respawnAll` son ahora un objeto en vez de varios parámetros.
En adición, el parámetro `spawnTimeout` fue renombrado a `timeout`.
Esto significa que el usuario ya no necesita escribir valores predeterminados para completar cada parámetro posicional.

```diff
- client.shard.respawnAll(5000, 500, 30000);
+ client.shard.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### ShardingManager

#### ShardingManager#broadcastEval

El método `ShardingManager#broadcastEval` ya no acepta un `String`, sino que espera una función. Ve `ShardClientUtil#broadcastEval`.

#### ShardingManager#spawn

Las opciones para el método `ShardingManager#spawn` son ahora un objeto en vez de varios parámetros.
En adición, el parámetro `spawnTimeout` fue renombrado a `timeout`.
Esto significa que el usuario ya no necesita escribir valores predeterminados para completar cada parámetro posicional.

```diff
- manager.spawn('auto', 5500, 30000);
+ manager.spawn({ amount: 'auto', delay: 5500, timeout: 30000 });
```

#### ShardingManager#respawnAll

Las opciones para el método `ShardingManager#respawnAll` son ahora un objeto en vez de varios parámetros.
En adición, el parámetro `spawnTimeout` fue renombrado a `timeout`.
Esto significa que el usuario ya no necesita escribir valores predeterminados para completar cada parámetro posicional.

```diff
- manager.respawnAll(5000, 500, 30000);
+ manager.respawnAll({ shardDelay: 5000, respawnDelay: 500, timeout: 30000 });
```

### TextChannel

#### TextChannel#startTyping

#### TextChannel#stopTyping

Ambos métodos han sido reemplazados por uno solo `TextChannel.sendTyping()`. Este método deja de escribir automáticamente después de 10 segundos o cuando se envia un mensaje.

### User

#### User#lastMessage

#### User#lastMessageId

Ninguna de estas propiedades fue proporcionada por Discord, sino que se basó en una caché de cliente potencialmente inexacta y fue eliminado.

#### User#locale

La propiedad `User.locale` fue removida, ya que esta propiedad no está expuesta a bots.

#### User#presence

La propiedad `User.presence` fue removida. Las presencias ahora solo se encuentran en `GuildMember`.

#### User#typingIn

Como discord.js ya no almacena en caché los datos de eventos de escritura, el metodo `User.typingIn()` fue removido.

#### User#typingSinceIn

Como discord.js ya no almacena en caché los datos de eventos de escritura, el metodo`User.typingSinceIn()` fue removido.

#### User#typingDurationIn

Como discord.js ya no almacena en caché los datos de eventos de escritura, el metodo `User.typingDurationIn()` fue removido.

### UserFlags

Las `UserFlags` obsoletas `DISCORD_PARTNER` y `VERIFIED_DEVELOPER` / `EARLY_VERIFIED_DEVELOPER` fueron removidas a favor de sus versiones renombradas.

```diff
- user.flags.has(UserFlags.FLAGS.DISCORD_PARTNER)
+ user.flags.has(UserFlags.FLAGS.PARTNERED_SERVER_OWNER)

- user.flags.has(UserFlags.FLAGS.VERIFIED_DEVELOPER)
+ user.flags.has(UserFlags.FLAGS.EARLY_VERIFIED_BOT_DEVELOPER)
```

La nueva `flag` `DISCORD_CERTIFIED_MODERATOR` fue agregada.

### Util

Se han eliminado los accesos directos a los métodos `Util` que se exportaron previamente al nivel superior.

#### Util#convertToBuffer

#### Util#str2ab

Ambos fueron eliminados a favor de los métodos de búfer integrados de Node.

#### Util#fetchRecommendedShards

El método `Util#fetchRecommendedShards()` ahora soporta opciones adicionales `multipleOf` para calcular el número a redondear, p. ej. un múltiplo de 16 para los `shards` de bot grandes.

#### Util#resolveString

El método `Util#resolveString` fue removido. discord.js ahora obliga a los usuarios a proporcionar `Strings` donde se espera en lugar de resolver una en su nombre.

### VoiceState

#### VoiceState#kick

El método `VoiceState#kick` fue renombrado a `VoiceState#disconnect`.

### WebhookClient

El constructor `WebhookClient` ya no acepta `id, token` como los primeros parámetros, en lugar de tomar un objeto `data`. Este objeto admite una opción adicional `url`, que permite la creación de un `WebhookClient` a partir de una URL de webhook.

```diff
- new WebhookClient(id, token, options);
+ new WebhookClient({ id, token }, options);

+ new WebhookClient({ url }, options);
```

## Additions

### ActivityTypes

Se ha añadido un nuevo tipo de actividad `COMPETING`.

### ApplicationCommand

Proporciona compatibilidad con API para `slash commands`.

### ApplicationCommandManager

Proporciona soporte API para crear, editar y eliminar `slash commands`.

### ApplicationCommandPermissionsManager

Proporciona compatibilidad con API para crear, editar y eliminar sobrescrituras de permisos en `slash commands`.

### ApplicationFlags

Proporciona un bitfield enumerado para las banderas de `ClientApplication`.

### BaseGuild

La nueva clase `BaseGuild` se extiende por `Guild` y `OAuth2Guild`.

### BaseGuildTextChannel

La nueva clase `BaseGuildTextChannel` se extiende por `TextChannel` y `NewsChannel`.

### BaseGuildVoiceChannel

La nueva clase `BaseGuildVoiceChannel` se extiende por `VoiceChannel` y `StageChannel`.

### ButtonInteraction

Proporciona soporte de `gateway` para `MessageComponentInteraction` viniendo de un componente de botón.

### Channel

#### Channel#isText()

Revisa y comprueba si un canal es `Text-Based` (Basado en texto); uno de `TextChannel`, `DMChannel`, `NewsChannel` o `ThreadChannel`.

#### Channel#isThread()

Revisa y comprueba si un canal es un `ThreadChannel`.

#### Channel#isVoice()

Revisa y comprueba si un canal es Voice-Based (Basado en voz); `VoiceChannel` o `StageChannel`.

### Client

#### Client#applicationCommandCreate

Emitido cuando un comando de aplicacion de guild es creado.

#### Client#applicationCommandDelete

Emitido cuando un comando de aplicacion de guild es eliminado.

#### Client#applicationCommandUpdate

Emitido cuando un comando de aplicacion de guild es actualizado.

#### Client#interactionCreate

Emitido cuando una interacción es creada.

#### Client#stageInstanceCreate

Emitido cuando una instancia de escenario es creada.

#### Client#stageInstanceDelete

Emitido cuando una instancia de escenario es eliminada.

#### Client#stageInstanceUpdate

Emitido cuando una instancia de escenario es actualizada, p.ej. cambio de tema o nivel de privacidad.

#### Client#stickerCreate

Emitido cuando un sticker personalizado es creado en un guild.

#### Client#stickerDelete

Emitido cuando un sticker personalizado es borrado en un guild.

#### Client#stickerUpdate

Emitido cuando un sticker personalizado es actualizado en un guild.

#### Client#threadCreate

Emitido cuando un thread es creado o si el bot es añadido a uno.

#### Client#threadDelete

Emitido cuando un thread es eliminado.

#### Client#threadListSync

Emitido cuando el cliente obtiene acceso a un canal de texto o de noticias que contiene threads.

#### Client#threadMembersUpdate

Emitido cuando se agregan o eliminan miembros de un thread. Requiere el intent privilegiado `GUILD_MEMBERS`.

#### Client#threadMemberUpdate

Emitido cuando se actualiza el miembro de un thread.

#### Client#threadUpdate

Emitido cuando un thread es actualizado, por ejemplo: cambia de nombre o estado a archivado o cerrado.

### ClientOptions

#### ClientOptions#failIfNotExists

El parámetro establece el comportamiento por defecto para `ReplyMessageOptions#failIfNotExists`, permitiendo o previniendo un error cuando se responde a un mensaje desconocido.

### CollectorOptions

#### CollectorOptions#filter

Este parámetro es opcional y recurrira a una función que siempre devuelve `true` si no se otorga ningun parámetro.

### CommandInteraction

Provee soporte de la gateway para las interacciones de los slash commands.
Para más información, visita la sección de [slash commands](/interactions/registering-slash-commands.html) de esta guía.

### Guild

#### Guild#bans

Provee acceso a `GuildBanManager` del guild.

#### Guild#create

`Guild#systemChannelFlags` ahora puede establecerse en el método `Guild#create`.

#### Guild#edit

Las propiedades `Guild#description` y `Guild#features` ahora pueden ser editadas.

#### Guild#editWelcomeScreen

Provee soporte de la API para que los bots editen el `WelcomeScreen` del guild.

#### Guild#emojis

La clase `GuildEmojiManager` ahora extiende `BaseGuildEmojiManager`.
En adición a los métodos existentes, ahora soporta `GuildEmojiManager#fetch`.

#### Guild#fetchWelcomeScreen

Provee soporte de la API para buscar el `WelcomeScreen` de los servidores.

#### Guild#fetchWidget

Provee soporte de la API para el Widget del servidor, conteniendo información sobre el servidor y sus miembros.

#### Guild#invites

Provee acceso al nuevo `GuildInviteManager`.

#### Guild#nsfwLevel

La propiedad `Guild#nsfwLevel` ahora se representa con el número `NSFWLevel`.

#### Guild#premiumTier

La propiedad `Guild#premiumTier` ahora se representa con el número `PremiumTier`.

#### Guild#setChannelPositions

Ahora soporta establecer la categoría para múltiples canales, y bloquea sus permisos vía las opciones `ChannelPosition#parent` y `ChannelPosition#lockPermissions`.

### GuildBanManager

Provee soporte improvisado a la API para manejar y obtener bans.

### GuildChannel

#### GuildChannel#clone

Ahora soporta establecer la propiedad `position`.

### GuildChannelManager

#### GuildChannelManager#fetch

Ahora soporta la consulta de varios canales de un servidor.

#### GuildChannelManager#fetchActiveThreads

Obtiene una lista de los hilos activos en el servidor.

### GuildInviteManager

Podrás crear y consultar invitaciones con el nuevo formato del administrador.
Esto reemplaza `Guild#fetchInvites`.

### GuildManager

#### GuildManager#create

Ahora funciona especificando los canales de AFK y sistema cuando se crea un guild.

#### GuildManager#fetch

Ahora soporta el poder consultar multiples guilds, devolviendo una `Promise<Collection<Snowflake, OAuth2Guild>>` si se usa de esta manera.

### GuildEmojiManager

#### GuildEmojiManager#fetch

Provee soporte de la API para el endpoint `GET /guilds/{guild.id}/emojis`.

### GuildMember

#### GuildMember#pending

Define si el miembro pasó la pantalla de bienvenida del servidor.
Devuelve `true` si no ha aceptado y emite el evento `guildMemberUpdate` cuando la acepta.

### GuildMemberManager

Se agregaron varios métodos a `GuildMemberManager` para proporcionar compatibilidad con API para miembros no almacenados en caché.

#### GuildMemberManager#edit

`guild.members.edit('123456789012345678', data, reason)` es equivalente a `GuildMember#edit(data, reason)`.

#### GuildMemberManager#kick

`guild.members.kick('123456789012345678', reason)` es equivalente a `GuildMember#kick(reason)`.

#### GuildMemberManager#search

Proporciona soporte de API para consultar `GuildMember`s.
`GuildMemberManager#fetch` usa el gateway para recibir información.

### GuildMemberRoleManager

#### GuildMemberRoleManager#botRole

Obtiene el rol administrado que el miembro creo al unirso al guild, si lo hay

#### GuildMemberRoleManager#premiumSubscriberRole

Obtiene el rol de suscriptor premium (booster) si el miembro lo presenta.

### GuildPreview

#### GuildPreview#createdAt

#### GuildPreview#createdTimestamp

La fecha `Date` de cuando se creó el `GuildPreview`

### GuildTemplate

Provee soporte de la API para [server templates](https://discord.com/developers/docs/resources/guild-template).

### Integration

#### Integration#roles

Una `Collection` de roles los cuales son administrados por una integración.

### Interaction

Provee soporte del gateway para los slash commands e interaciones de componentes de mensajes. 

Para más información consulta las páginas de [slash commands](/interactions/replying-to-slash-commands.md) y [message components](/interactions/buttons.html#responding-to-buttons.html) de esta guía.

### InteractionCollector

Provee una forma para que los usuarios recopilen cualquier tipo de interacción.
Esta clase tiene un diseño mas flexible que otros `Collectors`, pudiendo estar vinculado a cualquier gremio, canal o mensaje según corresponda.
Los desarrolladores de TypeScript pueden aprovechar los genericos para definir las subclases de interacciones las cuales seran devueltas.

### InteractionWebhook

Proporciona soporte de webhoook específicamente para interaciones debido a sus cualidades únicas.

### InviteGuild

Provee soporte de la API para un `Guild` parcial de un `Invite`.

### InviteStageInstance

Provee soporte de la API para invitar usuarios a escenarios.

### Message

#### Message#awaitMessageComponent

Un método de acceso directo para crear un `InteractionCollector` en forma de promesa que se resuelve en un solo `MessageComponentInteraction`.

#### Message#createMessageComponentCollector

Un método como atajo para crear `InteractionCollector` para componentes de un mensaje en específico.

#### Message#crosspostable

Verifica permisos para ver si puede publicar un mensaje.

#### Message#edit

Editar y/o eliminar los archivos adjuntos cuando editas un `Message` ahora es posible.

#### Message#fetchReference

Provee soporte para buscar el `Message` respondido con `Message#reference`, si el cliente tiene acceso para hacerlo.

#### Message#react

Ahora soporta `<:name:id>` y `<a:name:id>` como parámetros válidos.

#### Message#removeAttachments

Elimina los archivos adjuntos de un mensaje. Se necesita el permiso `MANAGE_MESSAGES` para eliminar los archivos adjuntos de mensajes de otros miembros.

#### Message#startThread

Comienza un `ThreadChannel` usando este mensaje como primer mensaje.

#### Message#stickers

Una `Collection` de stickers en un `Message`.

### MessageActionRow

Una clase constructora que hace la construcción de componentes de tipo `Fila de acción` más fácil.

### MessageAttachment

#### MessageAttachment#contentType

El tipo de contenido multimedia de un `MessageAttachment`.

### MessageButton

Una clase constructora que hace la construcción de componentes de tipo `Botón` más fácil.

### MessageComponentInteraction

Provee soporte del gateway para recibir interacciones de componentes. Subclase de `Interaction`.

### MessageEmbed

#### MessageEmbed#setFields

Reemplaza todos los campos de un embed con un nuevo array de campos proporcionado.

`embed.setFields(newFields)` es equivalente a `embed.spliceFields(0, embed.fields.length, newFields)`.

### MessageManager

Se añadieron métodos a `MessageManager` para dar soporte de la API para mensajes fuera del caché.

#### MessageManager#crosspost

`channel.messages.crosspost('876543210987654321')` es equivalente a `message.crosspost()`.

#### MessageManager#edit

`channel.messages.edit('876543210987654321', content, options)` es equivalente a `message.edit(content, options)`.

#### MessageManager#pin

`channel.messages.pin('876543210987654321', options)` no resuelve `Message`, `message.pin(options)` si.

#### MessageManager#react

`channel.messages.react('876543210987654321', emoji)` no resuelve `MessageReaction`, `message.react(emoji)` si.

#### MessageManager#unpin

`channel.messages.unpin('876543210987654321', options)` no resuelve `Message`, `message.unpin(options)` si.

### MessageMentions

#### MessageMentions#repliedUser

Revisa si el autor del mensaje respondido fue mencionado.

### MessagePayload

Esta clase fue renombrada de `APIMessage`.
Headers globales ahora pueden ser establecidos en las opciones HTTP.

### MessageSelectMenu

Una clase constructora que hace la construcción de componentes de tipo `Menú de selección` más fácil.

### NewsChannel

#### NewsChannel#addFollower

Proporciona soporte de API para seguir anuncios de otros canales.

#### NewsChannel#setType

Permite convertir entre `TextChannel` y `NewsChannel`.

### Permissions

#### Permissions#STAGE_MODERATOR

Bitfield estático que representa los permisos requeridos para moderar un canal de audiencia.

### PermissionOverwriteManager

Los métodos `createOverwrite`, `updateOverwrite` y `overwritePermissions` de `GuildChannel` ahora son accesibles desde `PermissionOverwriteManager`.

### Role

#### Role#tags

Contiene los etiquetas de un rol (si es de un bot, integración o suscribción premium)

### RoleManager

#### RoleManager#botRoleFor

Consigue el rol de un bot que se crea al unirse a un guild, si existe.

#### RoleManager#edit

`guild.roles.edit('123456789098765432', options)` es equivalente a `role.edit(options)`.

#### RoleManager#premiumSubscriberRole

Consigue el rol por boostear de un server, si existe.

### SelectMenuInteraction

Proporciona soporte de gateway para `MessageComponentInteraction` los cuales provienen de un select menu.

### StageChannel

Proporciona soporte de API para los canales de escenario (stage channels).

### StageInstance

Proporciona soporte de API para las instancias de escenarios. Las instancias de eventos contienen información de eventos en vivo.

### StageInstanceManager

Proporciona soporte de API para crear, editar y borrar escenarios (stage channels), al igual que almacenarlos en caché.

### Sticker

Proporciona soporte de API para los stickers de Discord.

### StickerPack

Proporciona soporte de API para los packs de stickers de Discord.

### TextChannel

#### TextChannel#awaitMessageComponent

Un método de acceso directo para crear un prometido `InteractionCollector` que se resuelve en una sola `MessageComponentInteraction`

#### TextChannel#createMessageComponentCollector

Un método de acceso directo para crear un `InteractionCollector` para componentes en un canal especifico.

#### TextChannel#setType

Permite convertir entre `TextChannel` y `NewsChannel`.

#### TextChannel#threads

Proporciona acceso al `ThreadManager` para este canal.

### ThreadChannel

Proporciona soporte de API para canales de `hilos`

### ThreadChannelManager

Proporciona soporte de API para que el bot cree, edite y elimine `hilos`, y almacene cache de `ThreadChannels`.

### ThreadMember

Rperesenta un miembro de un `hilo` y  sus metadatos especificos del `hilo` 

### ThreadMemberManager

Proporciona soporte de API para que el bot agregue y elimine miembros de un `hilo`, y almacena un caché de `ThreadMembers`.

### Webhook

#### Webhook#deleteMessage

Los Webhooks ahora pueden borrar mensajes enviados por el Webhook.

#### Webhook#editMessage

Los Webhooks ahora pueden editar mensajes que fueron enviados por el Webhook.

#### Webhook#fetchMessage

Los Webhooks ahora pueden recuperar los mensajes enviados por el Webhook.

#### Webhook#sourceChannel

#### Webhook#sourceGuild

Los Webhooks ahora pueden tener `sourceGuild` y `sourceChannel` si el mensaje es difundido (crosspost).

### WelcomeChannel

Representa los canales que se pueden ver en una `Guild#WelcomeScreen`.

### WelcomeScreen

Proporciona soporte de API para la pantalla de bienvenida de un `servidor`

### Widget

Representa un Widget de un `servidor` 

### WidgetMember

Información parcial sobre los miembros de un `servidor` almacenados en un widget.

### Util

#### Formateadores

Se proporcionan varias funciones de formateador nuevas en la clase Util, para manejar fácilmente la adición de rebajas a las cadenas de texto.

#### Util#resolvePartialEmoji

Un método auxiliar que intenta resolver las propiedades de un objecto emoji sin procesar apartir de datos de entrada, sin el uso de la clase `client` de discord.js o su EmojiManager.

#### Util#verifyString

Un método auxiliar que se utiliza para validar internamente los argumentos de cadena proporcionados a los métodos en discord.js.