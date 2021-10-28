# Botones

Con la API de `Componentes`, puede crear componentes de mensajes interactivos. En esta página, cubriremos cómo enviar, recibir y responder a `botones` usando discord.js.

::: tip
Esta página es un seguimiento de la [página de interacciones (comandos de barra)](/interacciones/registrando-comandos-de-barra.md). Por favor, léalos primero con atención para que pueda comprender los métodos utilizados en esta sección.
:::

## Construyendo y enviando botones

Los botones son parte de la clase `MessageComponent`, que se pueden enviar a través de mensajes o respuestas de interacción. Un botón, como cualquier otro componente de mensaje, debe estar en una `ActionRow`.

::: warning ADVERTENCIA
Puede tener un máximo de cinco `ActionRow` por mensaje y cinco `botones` dentro de una `ActionRow`.
:::

Para crear un botón, use las funciones de construcción `MessageActionRow()` y `MessageButton()` y luego pase el objeto resultante a `CommandInteraction#reply()` como `InteractionReplyOptions`:

```js {1,7-13,15}
const { MessageActionRow, MessageButton } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('primary')
					.setLabel('Primario')
					.setStyle('PRIMARY'),
			);

		await interaction.reply({ content: 'Pong!', components: [row] });
	}
});
```

::: tip
El ID personalizado es una cadena de texto definida por el desarrollador de hasta 100 caracteres.
:::

Reinicie su bot y luego envíe el comando a un canal al que su bot tenga acceso. Si todo va bien, debería ver algo como esto:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
		<template #actions>
			<DiscordButtons>
				<DiscordButton>Primario</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

También puede enviar componentes de mensaje dentro de una respuesta `efímera` o junto con incrustaciones de mensajes (embeds).

```js {1,12-16,18}
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		const row = new MessageActionRow()
			.addComponents(
				// ...
			);

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Algun titulo')
			.setURL('https://discord.js.org')
			.setDescription('Alguna descripción aquí');

		await interaction.reply({ content: 'Pong!', ephemeral: true, embeds: [embed], components: [row] });
	}
});
```

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
		<template #embeds>
			<DiscordEmbed
				border-color="#0099ff"
				embed-title="Algun titulo"
				url="https://discord.js.org"
			>
				Alguna descripción aquí
			</DiscordEmbed>
		</template>
		<template #actions>
			<DiscordButtons>
				<DiscordButton>Primario</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

### Botones desactivados

Si desea evitar que se use un botón, pero no eliminarlo del mensaje, puede deshabilitarlo con el método `setDisabled()`:

```js {5}
const button = new MessageButton()
	.setCustomId('primary')
	.setLabel('Primario')
	.setStyle('PRIMARY')
	.setDisabled(true);
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">ping</DiscordInteraction>
		</template>
		Pong!
		<template #actions>
			<DiscordButtons>
				<DiscordButton :disabled="true">Primario</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

### Botones de emoji

Si quieres usar un emoji de `servidor` dentro de un `MessageButton`, puedes usar el método `setEmoji() `:

```js {5}
const button = new MessageButton()
	.setCustomId('primary')
	.setLabel('Primario')
	.setStyle('PRIMARY')
	.setEmoji('123456789012345678');
```

¡Ahora ya sabe todo lo que hay que hacer para crear y enviar un `MessageButton`! ¡Pasemos a recibir interacciones de botones!

## Recibiendo botones

Para recibir una `ButtonInteraction`, adjunte un detector de eventos a su cliente y use la protección de tipo `Interaction#isButton() `para asegurarse de que solo reciba botones:

```js {2}
client.on('interactionCreate', interaction => {
	if (!interaction.isButton()) return;
	console.log(interaction);
});
```

## Colleciones de botones

Estos funcionan de manera bastante similar a los `collectors` de mensajes y reacciones, excepto que recibirá instancias de la clase `MessageComponentInteraction` como elementos recopilados.

::: tip
Puede crear los `collectors` en un `mensaje` o en un `canal`.
:::

Para obtener una guía detallada sobre la recepción de componentes de mensajes a través de `collectors`, consulte la [guía de colleciones](/temas-populares/recolectores.html#recolectores-de-interacciones).

## Respondiendo a botones

La clase `MessageComponentInteraction` proporciona los mismos métodos que la clase `CommandInteraction`. Estos métodos se comportan igualmente:
- `reply()`
- `editReply()`
- `deferReply()`
- `fetchReply()`
- `deleteReply()`
- `followUp()`

### Actualización del mensaje de un botón

La clase `MessageComponentInteraction` proporciona un método
`update()` para actualizar el mensaje al que está adjunto el menú de selección. Pasar una matriz (array) vacía a la opción `componentes` eliminará cualquier botón después de que se haya hecho click en alguno de ellos.

<!-- eslint-skip -->

```js {6-8}
const filter = i => i.customId === 'primary' && i.user.id === '122157285790187530';

const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

collector.on('collect', async i => {
	if (i.customId === 'primary') {
		await i.update({ content: '¡Se hizo clic en un botón!', components: [] });
	}
});

collector.on('end', collected => console.log(`${collected.size} items coleccionados`));
```

### Aplazamiento y actualización del mensaje de un botón

Además de aplazar una respuesta de interacción, puede aplazar el botón, que activará un estado de carga y luego volverá a su estado original:

<!-- eslint-skip -->

```js {7-9}
const wait = require('util').promisify(setTimeout);

// ...

collector.on('collect', async i => {
	if (i.customId === 'primary') {
		await i.deferUpdate();
		await wait(4000);
		await i.editReply({ content: '¡Se hizo clic en un botón!', components: [] });
	}
});

collector.on('end', collected => console.log(`Collected ${collected.size} items`));
```


## Estilos de botones

Actualmente hay cinco estilos de botones diferentes disponibles:
- `PRIMARY`, un botón azul borroso;
- `SECONDARY`, un botón gris;
- `SUCCESS`, un botón verde;
- `DANGER`, un botón rojo;
- `LINK`, un botón que redirige a una URL.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #actions>
			<DiscordButtons>
				<DiscordButton>Primario</DiscordButton>
				<DiscordButton type="secondary">Secondario</DiscordButton>
				<DiscordButton type="success">Éxito</DiscordButton>
				<DiscordButton type="danger">Peligro</DiscordButton>
				<DiscordButton type="link" url="https://discord.js.org">Enlace</DiscordButton>
			</DiscordButtons>
		</template>
	</DiscordMessage>
</DiscordMessages>

::: warning ADVERTENCIA
Solo los botones `LINK` pueden tener una `URL`. Los botones `LINK` _no_ pueden tener un `custom_id` y _no_ envían un evento de interacción cuando se hace clic en ellos.
:::
