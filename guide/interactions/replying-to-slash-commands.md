# Responder a los comandos de barra

Discord ofrece a los desarrolladores la opción de crear comandos de barra integrados en el cliente. En esta sección, cubriremos cómo responder a estos comandos usando discord.js.

::: tip
Necesita al menos un comando de barra registrado en su aplicación para continuar con las instrucciones en esta página. Si aún no lo ha hecho, consulte [la página anterior](/interactions/registering-slash-commands.md).
:::

## Recibir interacciones

Cada comando de barra es una `interacción`, por lo que para responder a un comando, debe configurar un detector de eventos que ejecutará el código cuando su aplicación reciba una interacción:

```js
client.on('interactionCreate', interaction => {
	console.log(interaction);
});
```

Sin embargo, no todas las interacciones son un comando de barra (por ejemplo, `Componentes`). Asegúrese de recibir solo comandos de barra haciendo uso del método `CommandInteraction#isCommand()`:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;
	console.log(interaction);
});
```

## Respondiendo a un comando

Hay varias formas de responder a un comando de barra, cada una de las cuales se describe en los siguientes segmentos.
La forma más común de enviar una respuesta es mediante el método `CommandInteraction#reply()`:

::: warning ADVERTENCIA
Inicialmente, un `token` de interacción solo es válido durante tres segundos, por lo que ese es el período de tiempo en el que puede utilizar el método `CommandInteraction#reply()`. Las respuestas que requieren más tiempo ("Respuestas diferidas") se explican más adelante en esta página.
:::

```js {1,4-6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});
```

Reinicie su `bot` y luego envíe el comando a un canal al que su `bot` tenga acceso. Si todo va bien, debería ver algo como esto:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

¡Ha enviado con éxito una respuesta a un comando de barra! Esto es solo el comienzo, hay más que tener en cuenta, ¡así que pasemos a otras formas de responder a un comando!


## Respuestas efímeras

Es posible que no siempre desee que todos los que tienen acceso al canal vean la respuesta de un comando de barra. Afortunadamente, Discord implementó una forma de ocultar mensajes a todos menos al ejecutor del comando de barra. Este tipo de mensaje se llama `efímero` y se puede configurar mediante `ephemeral: true` en `InteractionReplyOptions`, de la siguiente manera:

```js {5}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply({ content: 'Pong!', ephemeral: true });
	}
});
```

Ahora, cuando ejecute su comando nuevamente, debería ver algo como esto:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
				:ephemeral="true"
			>ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
</DiscordMessages>

## Editando respuestas

Después de enviar una respuesta inicial, es posible que desee editar esa respuesta por varios motivos. Esto se puede lograr con el método `CommandInteraction#editReply()`:

::: warning ADVERTENCIA
Después de la respuesta inicial, un token de interacción es válido durante 15 minutos, por lo que este es el período de tiempo en el que puede editar la respuesta y enviar mensajes de seguimiento.
:::

```js {1,8-9}
const wait = require('util').promisify(setTimeout);

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2000);
		await interaction.editReply('¡Pong de nuevo!');
	}
});
```

## Respuestas diferidas

Como se mencionó anteriormente, tiene tres segundos para responder a una interacción antes de que su token deje de ser válido. Pero, ¿qué sucede si tiene un comando que realiza una tarea que tarda más de tres segundos antes de poder responder?

En este caso, puede hacer uso del método `CommandInteraction#deferReply()`, que activa el mensaje `<application> esta pensando ...` y también actúa como respuesta inicial. Esto le permite 15 minutos para completar sus tareas antes de responder.
<!--- here either display the is thinking message via vue-discord-message or place a screenshot -->

```js {7-9}
const wait = require('util').promisify(setTimeout);

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.deferReply();
		await wait(4000);
		await interaction.editReply('Pong!');
	}
});
```

Si tiene un comando que realiza tareas más largas, asegúrese de llamar a `deferReply()` lo antes posible.

También puede pasar una marca `efímera` a `InteractionDeferOptions`:

<!-- eslint-skip -->

```js
await interaction.deferReply({ ephemeral: true });
```

## Seguimientos

Responder a los comandos de barra es genial y todo, pero ¿qué sucede si desea enviar varias respuestas en lugar de solo una? Los mensajes de seguimiento lo cubren, puede usar `CommandInteraction#followUp()` para enviar múltiples respuestas:

::: warning ADVERTENCIA
Después de la respuesta inicial, un `token` de interacción es válido durante 15 minutos, por lo que este es el período de tiempo en el que puede editar la respuesta y enviar mensajes de seguimiento.
:::

```js {6}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await interaction.followUp('¡Pong de nuevo!');
	}
});
```

Si ejecuta este código, debería terminar teniendo algo parecido a esto:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot">Pong!</DiscordInteraction>
		</template>
		¡Pong de nuevo!
	</DiscordMessage>
</DiscordMessages>

También puede pasar una marca `efímera` a `InteractionReplyOptions`:

<!-- eslint-skip -->

```js
await interaction.followUp({ content: '¡Pong de nuevo!', ephemeral: true });
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="bot" :ephemeral="true">Pong!</DiscordInteraction>
		</template>
		¡Pong de nuevo!
	</DiscordMessage>
</DiscordMessages>

Eso es todo, ahora sabes todo lo que hay que saber sobre cómo responder a los comandos de barra.

::: tip
Las respuestas de interacción pueden usar enlaces enmascarados (e.g. `[Google](http://google.com)`) y emojis globales en el contenido del mensaje.
:::

## Analizando opciones

### Opciones de comando

En esta sección, cubriremos cómo acceder a los valores de las opciones de un comando. Supongamos que tiene un comando que contiene las siguientes opciones:

```js {4-35}
const data = {
	name: 'ping',
	description: '¡Respuestas con Pong!',
	options: [
		{
			name: 'input',
			description: 'Ingrese una cadena de texto',
			type: 'STRING',
		},
		{
			name: 'int',
			description: 'Ingrese un número entero',
			type: 'INTEGER',
		},
		{
			name: 'num',
			description: 'Ingrese un numero',
			type: 'NUMBER',
		},
		{
			name: 'choice',
			description: 'Seleccione un booleano',
			type: 'BOOLEAN',
		},
		{
			name: 'target',
			description: 'Selecciona un usuario',
			type: 'USER',
		},
		{
			name: 'destination',
			description: 'Seleccionar un canal',
			type: 'CHANNEL',
		},
		{
			name: 'muted',
			description: 'Seleccione un rol',
			type: 'ROLE',
		},
		{
			name: 'mentionable',
			description: 'Menciona algo',
			type: 'MENTIONABLE',
		},
	],
};
```

Puede obtener estas opciones con `get()` desde el `CommandInteractionOptionResolver` como se muestra a continuación:

```js
const string = interaction.options.getString('input');
const integer = interaction.options.getInteger('int');
const number = interaction.options.getNumber('num');
const boolean = interaction.options.getBoolean('choice');
const user = interaction.options.getUser('target');
const member = interaction.options.getMember('target');
const channel = interaction.options.getChannel('destination');
const role = interaction.options.getRole('muted');
const mentionable = interaction.options.getMentionable('mentionable');

console.log([string, integer, boolean, user, member, channel, role, mentionable]);
```

::: tip

Si desea el `snowflake` de una estructura en su lugar, tome la opción a través de `get()` y acceda al `snowflake` a través de la propiedad `value`. Tenga en cuenta que debe usar `const {value: name} = ...` aquí para [desestructurar y renombrar](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) el valor obtenido de la estructura <DocsLink path ="typedef/CommandInteractionOption"> `CommandInteractionOption` </DocsLink> para evitar conflictos de nombres de identificadores.

:::

### Subcomandos

Si tiene un comando que contiene subcomandos, puede analizarlos de una manera muy similar a los ejemplos anteriores.
Digamos que su comando se ve así:

```js {4-22}
const data = {
	name: 'info',
	description: '¡Obtén información sobre un usuario o el servidor!',
	options: [
		{
			name: 'user',
			description: 'Información sobre un usuario',
			type: 'SUB_COMMAND',
			options: [
				{
					name: 'target',
					description: 'El usuario',
					type: 'USER',
				},
			],
		},
		{
			name: 'server',
			description: 'Información sobre el servidor',
			type: 'SUB_COMMAND',
		},
	],
};
```

El siguiente fragmento detalla la lógica necesaria para analizar los subcomandos y responder en consecuencia utilizando el método `CommandInteractionOptionResolver#getSubcommand()`:

```js {5-20}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'info') {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
				await interaction.reply(`Username: ${user.username}\nID: ${user.id}`);
			} else {
				await interaction.reply(`Tu username: ${interaction.user.username}\nTu ID: ${interaction.user.id}`);
			}
		} else if (interaction.options.getSubcommand() === 'server') {
			await interaction.reply(`Nombre del servidor: ${interaction.guild.name}\nMiembros en total: ${interaction.guild.memberCount}`);
		}
	}
});
```

## Obteniendo y eliminando respuestas

::: danger PELIGRO
_No_ puede buscar ni borrar un mensaje efímero.
:::

Además de responder a un comando de barra, es posible que también desee eliminar la respuesta inicial. Puede usar `CommandInteraction#deleteReply()` para esto:
<!-- eslint-skip -->

```js {2}
await interaction.reply('Pong!');
await interaction.deleteReply();
```

Por último, es posible que necesite el objeto `Message` de una respuesta por varias razones, como agregar reacciones. Puede usar el método `CommandInteraction#fetchReply()` para obtener la instancia de `Message` de una respuesta inicial:

<!-- eslint-skip -->

```js
await interaction.reply('Pong!');
const message = await interaction.fetchReply();
console.log(message);
```
