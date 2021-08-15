# Preguntas frecuentes (FAQ)

## Leyenda

* `<client>` es un marcador de posición para el objeto <DocsLink path="class/Client" />, como `const client = new Client({ intents: [Intents.FLAGS.GUILDS] });`.
* `<interaction>` es un marcador de posición para el objeto <DocsLink path="class/Interaction" />, como `client.on('interactionCreate', interaction => { ... });`.
* `<guild>` es un marcador de posición para el objeto <DocsLink path="class/Guild" />, como `<interaction>.guild` o `<client>.guilds.cache.get('<id>')`.
* `<voiceChannel>`es un marcador de posición para el objeto <DocsLink path="class/VoiceChannel" />, como `<message>.member.voice.channel`

Para obtener una explicación más detallada de las notaciones que se usan comúnmente en esta guía, los documentos y el servidor de soporte, consulte [aquí](/additional-info/notation.md).

## Administrativo

### ¿Cómo banear a un usuario?

```js
const user = interaction.options.getUser('target');
guild.members.ban(user);
```

### ¿Cómo desbaneo un usuario?

```js
const id = interaction.options.get('target')?.value;
guild.members.unban(id);
```

::: tip
Debido a que no puede hacer ping a un usuario que no está en el servidor, debe pasar la identificación del usuario. Para hacer esto, usamos un <DocsLink path="typedef/CommandInteractionOption" />. Mira [aquí](/interactions/replying-to-slash-commands.html#analizando-opciones) para obtener más información sobre este tema.
:::

### ¿Cómo expulso a un usuario?

```js
const member = interaction.options.getMember('target');
member.kick();
```

### ¿Cómo agrego un rol a un miembro de servidor?

```js
const role = interaction.options.getRole('role');
const member = interaction.options.getMember('target');
member.roles.add(role);
```

### ¿Cómo verifico que un miembro tiene un rol especifico?

```js
const member = interaction.options.getMember('target');
if (member.roles.cache.some(role => role.name === 'role name')) {
	// ...
}
```

### ¿Cómo limito un comando a un solo usuario?

```js
if (interaction.user.id === 'id') {
	// ...
}
```

## Configuración y utilidad del bot

### ¿Cómo establezco el nombre de usuario de mi bot?

```js
client.user.setUsername('username');
```

### ¿Cómo establezco el avatar de mi bot?

```js
client.user.setAvatar('URL or path');
```

### ¿Cómo establezco el estado de juego?

```js
client.user.setActivity('activity');
```

### ¿Cómo establezco el estado en "Mirando / Escuchando / Compitiendo en ..."?

```js
client.user.setActivity('actividad', { type: 'WATCHING' });
client.user.setActivity('actividad', { type: 'LISTENING' });
client.user.setActivity('actividad', { type: 'COMPETING' });
```

::: tip
Si desea configurar su actividad al inicio, puede usar el objeto `ClientOptions` para configurar los datos de` Presence` apropiados.
:::

### ¿Cómo hago para que mi bot se muestre en línea / inactivo / dnd / invisible?

```js
client.user.setStatus('online');
client.user.setStatus('idle');
client.user.setStatus('dnd');
client.user.setStatus('invisible');
```

### ¿Cómo establezco el estado y la actividad de una sola vez?

```js
client.user.setPresence({ activities: [{ name: 'actividad' }], status: 'idle' });
```

## Variados

### ¿Cómo envío un mensaje a un canal específico?

```js
const channel = client.channels.cache.get('id');
channel.send('contenido');
```

### ¿Cómo hago DM a un usuario específico?

```js
const user = client.users.cache.get('id');
user.send('contenido');
```

::: tip
Si desea enviar un mensaje directo al usuario que envió la interacción, puede usar `interaction.user.send()`.
:::

### ¿Cómo menciono a un usuario específico en un mensaje?

<!-- eslint-skip -->

```js
const user = interaction.options.getUser('target');
await interaction.reply(`Hola, ${user}.`);
await interaction.followUp('Hola, <@user id>.');
```

::: tip
Las menciones en incrustaciones pueden resolverse correctamente en la descripción de incrustaciones (embeds) y los valores de campo, pero nunca notificarán al usuario. Otras áreas no admiten menciones en absoluto.
:::

### ¿Cómo controlo qué usuarios y/o roles se mencionan en un mensaje?

El control de qué menciones enviarán un ping se realiza a través de la opción `allowedMentions`, que reemplaza a `disableMentions`.

Esto se puede configurar como predeterminado en `ClientOptions`, y se puede controlar por mensaje enviado por su bot.
```js
new Client({ allowedMentions: { parse: ['users', 'roles'] } });
```

Se puede lograr aún más control al enumerar `usuarios` o `roles` específicos que se mencionarán por ID, por ejemplo:
```js
channel.send({
	content: '<@123456789012345678> <@987654321098765432> <@&102938475665748392>',
	allowedMentions: { users: ['123456789012345678'], roles: ['102938475665748392'] },
});
```

### ¿Cómo solicito al usuario información adicional?

```js
interaction.reply('Ingrese más información.').then(() => {
	const filter = m => <interaction>.user.id === m.author.id;

	interaction.channel.awaitMessages({ filter, time: 60000, max: 1, errors: ['time'] })
		.then(messages => {
			interaction.followUp(`Has ingresado: ${messages.first().content}`);
		})
		.catch(() => {
			interaction.followUp('¡No ingresaste nada!');
		});
});
```

::: tip
Si desea obtener más información sobre esta sintaxis u otros tipos de colecciones, consulte [esta página de guía dedicada para `collectors`](/popular-topics/collectors.md).
:::

### ¿Cómo puedo bloquear a un usuario para que no use mi bot?

<!-- eslint-disable no-useless-return -->

```js
const blockedUsers = ['id1', 'id2'];
client.on('interactionCreate', interaction => {
	if (blockedUsers.includes(interaction.user.id)) return;
});
```

::: tip
No es necesario que tenga una variable local constante como `blockUsers` anterior. Si tiene un sistema de base de datos que usa para almacenar los ID de los usuarios bloqueados, puede consultar la base de datos en su lugar:

<!-- eslint-disable no-useless-return -->

```js
client.on('interactionCreate', async interaction => {
	const blockedUsers = await database.query('SELECT user_id FROM blocked_users;');
	if (blockedUsers.includes(interaction.user.id)) return;
});
```

Tenga en cuenta que esto es solo una muestra de cómo podría hacer tal verificación.
:::

### ¿Cómo reacciono al mensaje que envió mi bot?

```js
interaction.channel.send('Mi mensaje para reaccionar.').then(sentMessage => {
	// Unicode emoji
	sentMessage.react('👍');

	// Custom emoji
	sentMessage.react('123456789012345678');
	sentMessage.react('<emoji:123456789012345678>');
	sentMessage.react('<a:emoji:123456789012345678>');
	sentMessage.react('emoji:123456789012345678');
	sentMessage.react('a:emoji:123456789012345678');
});
```

::: tip
Si desea obtener más información sobre las reacciones, consulte [esta guía dedicada a las reacciones](/popular-topics/react.md).
:::

### ¿Cómo reinicio mi bot con un comando?

```js
process.exit();
```

::: danger PELIGRO
`process.exit()`solo matará su proceso de Node, pero al usar [PM2](http://pm2.keymetrics.io/), reiniciará el proceso cada vez que muera. Puede leer nuestra guía sobre PM2 [aquí](/improving-dev-environment/pm2.md).
:::

## #¿Cuál es la diferencia entre un usuario y un miembro de servidor?

Un `User` representa a un usuario global de Discord y un `GuildMember` representa a un usuario de Discord en un servidor específico. Eso significa que solo los `GuildMembers` pueden tener permisos, roles y apodos, por ejemplo, porque todas estas cosas son información vinculada al servidor que podría ser diferente en cada servidor en el que se encuentre el usuario.

### ¿Cómo encuentro a todos los miembros en línea de un gremio?

```js
// First use guild.members.fetch to make sure all members are cached
guild.members.fetch().then(fetchedMembers => {
	const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online');
	// Now you have a collection with all online member objects in the totalOnline variable
	console.log(`¡Actualmente hay ${totalOnline.size} miembros en línea en este servidor!`);
});
```

::: warning ADVERTENCIA
Esto solo funciona correctamente si tiene habilitada la intención `GUILD_PRESENCES` para su aplicación y cliente.
Si desea obtener más información sobre las intenciones, consulte [esta guía dedicada a las intenciones](/popular-topics/intents.md).
:::

### ¿Cómo verifico qué función se agregó/eliminó y para qué miembro?

```js
// Comience declarando un evento guildMemberUpdate
// Este código debe colocarse fuera de cualquier otra devolución de llamada del evento para evitar eventos anidados
client.on('guildMemberUpdate', (oldMember, newMember) => {
	// Si los roles están presentes en el objeto miembro antiguo pero ya no en el nuevo (es decir, se eliminaron los roles)
	const removedRoles = oldMember.roles.cache.filter(role => !newMember.roles.cache.has(role.id));
	if (removedRoles.size > 0) {
		console.log(`Los roles ${removedRoles.map(r => r.name)} han sido removidos de ${oldMember.displayName}.`);
	}

	// Si los roles están presentes en el nuevo objeto miembro pero no en el anterior (es decir, se agregaron roles)
	const addedRoles = newMember.roles.cache.filter(role => !oldMember.roles.cache.has(role.id));
	if (addedRoles.size > 0) {
		console.log(`los roles ${addedRoles.map(r => r.name)} han sido agregados a ${oldMember.displayName}.`);
	}
});
```

### ¿Cómo verifico el ping del bot?

Hay dos medidas comunes para los bots. El primero, **`Websocket heartbeat`**, es el intervalo promedio de una señal enviada regularmente que indica el buen funcionamiento de la conexión `WebSocket` sobre la que la biblioteca recibe eventos:

```js
interaction.reply(`Websocket latencia: ${<client>.ws.ping}ms.`);
```

::: tip
Se puede encontrar un latido de un `shard` específico en la instancia de WebSocketShard, accesible en `<client>.ws.shards` > `.ping`.
:::

El segundo, **Latencia de ida y vuelta**, describe la cantidad de tiempo que lleva una ida y vuelta completa de la API (desde la creación del mensaje de comando hasta la creación del mensaje de respuesta). Luego edita la respuesta al valor respectivo para evitar tener que enviar otro mensaje:

```js
interaction.reply('Calculando...', { fetchReply: true })
	.then(sent => {
		sent.edit(`Latencia de ida y vuelta: ${sent.createdTimestamp - <interaction>.createdTimestamp}ms`);
	});
```

### ¿Cómo reproduzco música de YouTube?

Para que esto funcione, necesita tener instalados `ytdl-core` y `@discordjs/voice`.

```bash
npm install ytdl-core @discordjs/voice
```

Además, es posible que necesite lo siguiente:

```bash
npm install --save @discordjs/opus # opus engine (if missing)
sudo apt-get install ffmpeg # ffmpeg debian/ubuntu
npm install ffmpeg-static # ffmpeg windows
```

```js
const ytdl = require('ytdl-core');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
} = require('@discordjs/voice');

// ...

const connection = joinVoiceChannel({
	channelId: voiceChannel.id,
	guildId: guild.id,
	adapterCreator: guild.voiceAdapterCreator,
});

const stream = ytdl('link de youtube', { filter: 'audioonly' });
const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
const player = createAudioPlayer();

player.play(resource);
connection.subscribe(player);

player.on(AudioPlayerStatus.Idle, () => connection.destroy());
```

::: tip
Puede obtener más información sobre estos métodos en la [sección de voz de esta guía](/voice).
:::

### ¿Por qué algunos emojis se comportan de manera extraña?

Si ha intentado utilizar [el método habitual para recuperar emojis Unicode](/popular-topics/react.md#unicode-emojis), es posible que haya notado que algunos caracteres no proporcionan los resultados esperados. Aquí hay un breve fragmento que lo ayudará con ese problema. ¡Puedes guardarlo en un archivo propio y usarlo en cualquier lugar que necesites! Alternativamente, siéntase libre de simplemente copiar y pegar los caracteres de abajo:

```js
// emojiCharacters.js
module.exports = {
	a: '🇦', b: '🇧', c: '🇨', d: '🇩',
	e: '🇪', f: '🇫', g: '🇬', h: '🇭',
	i: '🇮', j: '🇯', k: '🇰', l: '🇱',
	m: '🇲', n: '🇳', o: '🇴', p: '🇵',
	q: '🇶', r: '🇷', s: '🇸', t: '🇹',
	u: '🇺', v: '🇻', w: '🇼', x: '🇽',
	y: '🇾', z: '🇿', 0: '0️⃣', 1: '1️⃣',
	2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣',
	6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣',
	10: '🔟', '#': '#️⃣', '*': '*️⃣',
	'!': '❗', '?': '❓',
};
```

```js
// index.js
const emojiCharacters = require('./emojiCharacters.js');

console.log(emojiCharacters.a); // 🇦
console.log(emojiCharacters[10]); // 🔟
console.log(emojiCharacters['!']); // ❗
```

::: tip
En Windows, es posible que pueda usar el método abreviado de teclado `Win + .` para abrir un selector de emoji que se puede usar para un acceso rápido y fácil a todos los emojis Unicode disponibles para usted. Sin embargo, es posible que algunos de los emojis enumerados anteriormente no estén representados allí (por ejemplo, los emojis 0-9).
:::
