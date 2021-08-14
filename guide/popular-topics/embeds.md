# Embeds

Si has estado en Discord durante un tiempo, es probable que hayas visto estos mensajes especiales, normalmente enviados por bots. 
Pueden tener un borde coloreado, imágenes incluidas, campos de texto y otras propiedades de lujo.

En la siguiente sección, explicaremos cómo componer un embed, enviarlo, y qué debes tener en cuenta al hacerlo.

## Previsualización

Este es un ejemplo de cómo puede verse un embed. Revisaremos la construcción de embeds en la siguiente parte de esta guía.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #embeds>
			<DiscordEmbed
				border-color="#0099ff"
				embed-title="Some title"
				url="https://discord.js.org/"
				thumbnail="https://i.imgur.com/AfFp7pu.png"
				image="https://i.imgur.com/AfFp7pu.png"
				footer-icon="https://i.imgur.com/AfFp7pu.png"
				timestamp="01/01/2018"
				author-name="Some name"
				author-icon="https://i.imgur.com/AfFp7pu.png"
				author-url="https://discord.js.org/"
			>
				Some description here
				<template #fields>
					<DiscordEmbedFields>
						<DiscordEmbedField field-title="Regular field title">
							Some value here
						</DiscordEmbedField>
						<DiscordEmbedField field-title="​">
							​
						</DiscordEmbedField>
						<DiscordEmbedField :inline="true" field-title="Inline field title">
							Some value here
						</DiscordEmbedField>
						<DiscordEmbedField :inline="true" field-title="Inline field title">
							Some value here
						</DiscordEmbedField>
						<DiscordEmbedField :inline="true" field-title="Inline field title">
							Some value here
						</DiscordEmbedField>
					</DiscordEmbedFields>
				</template>
				<template #footer>
					<span>Some footer text here</span>
				</template>
			</DiscordEmbed>
		</template>
	</DiscordMessage>
</DiscordMessages>

## Usar el contructor de embeds

discord.js cuenta con la utilidad <DocsLink path="class/MessageEmbed">`MessageEmbed`</DocsLink> para una construcción y manipulación sencilla de embeds.

```js
// arriba de tu archivo
const { MessageEmbed } = require('discord.js');

// dentro de un comando, audiencia de evento, etc.
const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Regular field title', value: 'Some value here' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
		{ name: 'Inline field title', value: 'Some value here', inline: true },
	)
	.addField('Inline field title', 'Some value here', true)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/AfFp7pu.png');

channel.send({ embeds: [exampleEmbed] });
```

::: tip
No es necesario que incluyas todos los elementos mostrados arriba. Si quieres un embed más sencillo, no uses algunos.
:::

El medio `.setColor()`, acepta datos enteros, cadena de color HEX, una formación de valores RGB, o cadenas de color específicas. Encuentra una lista de estos en <DocsLink path="typedef/ColorResolvable">la documentación de discord.js</DocsLink>.

Para añadir un campo vacío a tu embed, puedes usar `.addField('\u200b', '\u200b')`.

El ejemplo de arriba une los métodos de manipulación con el objeto MessageEmbed recién creado.
Si quieres modificar tu embed en base a condiciones, necesitarás referenciarlo como la constante `exampleEmbed` (para nuestro ejemplo).

<!-- eslint-skip -->

```js
const exampleEmbed = new MessageEmbed().setTitle('Some title');

if (message.author.bot) {
	exampleEmbed.setColor('#7289da');
}
```

## Usar un objeto incrustado (embed)

<!-- eslint-disable camelcase -->

```js
const exampleEmbed = {
	color: 0x0099ff,
	title: 'Some title',
	url: 'https://discord.js.org',
	author: {
		name: 'Some name',
		icon_url: 'https://i.imgur.com/AfFp7pu.png',
		url: 'https://discord.js.org',
	},
	description: 'Some description here',
	thumbnail: {
		url: 'https://i.imgur.com/AfFp7pu.png',
	},
	fields: [
		{
			name: 'Regular field title',
			value: 'Some value here',
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: false,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
		{
			name: 'Inline field title',
			value: 'Some value here',
			inline: true,
		},
	],
	image: {
		url: 'https://i.imgur.com/AfFp7pu.png',
	},
	timestamp: new Date(),
	footer: {
		text: 'Some footer text here',
		icon_url: 'https://i.imgur.com/AfFp7pu.png',
	},
};

channel.send({ embeds: [exampleEmbed] });
```

::: tip
No es necesario que incluyas todos los elementos mostrados arriba. Si quieres un embed más sencillo, no uses algunos.
:::

Si quieres modificar tu embed en base a condiciones, necesitarás referenciarlo directamente (como la constante `exampleEmbed` para nuestro ejemplo). Luego puedes re(asignar) los valores de sus propiedades como lo harías con cualquier otro objeto.

```js
const exampleEmbed = { title: 'Some title' };

if (message.author.bot) {
	exampleEmbed.color = 0x7289da;
}
```

## Adjuntar imagenes

Puedes subir imágenes junto a tus mensajes incrustados (embedded) y usarlos como fuente para espacios que soporten urls de imágenes, construyendo un <DocsLink path="class/MessageAttachment">MessageAttachment</DocsLink> para que estos se envíen como opción de mensaje junto al embed. El parámetro para adjuntar usa un BufferResolvable o Stream incluyendo la URL de una imágen externa.

Luego puedes referenciar y usar las imágenes dentro del embed en sí con: `attachment://fileName.extension`.

::: tip
Si planeas adjuntar la misma imágen repetidamente, mejor considera alojarla online y proveer la URL en el respectivo campo de embed. Esto también hace que tu bot responda más rápido, ya que no necesita subir la imagen dependiendo de cada respuesta.
:::

### Usar el constructor de MensajeEmbed

```js
const { MessageAttachment, MessageEmbed } = require('discord.js');
// ...
const file = new MessageAttachment('../assets/discordjs.png');
const exampleEmbed = new MessageEmbed()
	.setTitle('Some title')
	.setImage('attachment://discordjs.png');

channel.send({ embeds: [exampleEmbed], files: [file] });
```

### Usar un objeto embed

```js
const { MessageAttachment } = require('discord.js');
// ...
const file = new MessageAttachment('../assets/discordjs.png');

const exampleEmbed = {
	title: 'Some title',
	image: {
		url: 'attachment://discordjs.png',
	},
};

channel.send({ embeds: [exampleEmbed], files: [file] });
```

::: warning ADVERTENCIA
Si la imagen no se muestran dentro del embed, pero sí fuera de este; revisa tu sintaxis para asegurarte que está como se muestra arriba.
:::

## Reenviar y Editar

Ahora explicaremos cómo editar el contenido de mensajes en embed y reenviar un embed recivido.

### Reenviar un embed recivido

Para direccionar un embed recivido, lo recuperas de la matriz de embeds (`message.embeds`), y lo pasas al MessageEmbed, en donde puede ser editado antes de ser enviado otra vez. 

::: warning ADVERTENCIA
Aquí creamos deliberadamente un nuevo Embed en ves de modificar directamente el `message.embeds[0]`, para mantener el caché válido. Si no hiciéramos esto, el embed con el caché original diferiría de la forma original del Embed; lo que resultaría en comportamiento inadecuado más adelante!
:::

```js
const receivedEmbed = message.embeds[0];
const exampleEmbed = new MessageEmbed(receivedEmbed).setTitle('New title');

channel.send({ embeds: [exampleEmbed] });
```

### Editar el contenido de un mensaje en Embed

Para editar el contenido de un Embed, debes pasar a una nueva estructura MessageEmbed o cambiar el objeto embed a `.edit()`.

```js
const exampleEmbed = new MessageEmbed()
	.setTitle('Some title')
	.setDescription('Description after the edit');

message.edit({ embeds: [exampleEmbed] });
```

Si quieres construir nuevos datos de Embed a una plantilla de un embed previamente enviado, asegúrate de leer las advertencias de la sección anterior. 

## Notas

- Para mostrar campos lado a lado, necesitar por lo menos dos campos consecutivos ajustados en `inline`
- Los marcadores de horas se ajustan automáticamente a las distintas zonas temporales dependiendo del dispositivo del usuario.
- Menciones de cualquier tipo sólo se mostrarán correctamente en campos con valores y descripciones.
- Menciones en embeds no notificarán.
- Embeds permiten links enmascarados 
- Embeds allow masked links (ej. `[Guía](https://discordjs.guide/ 'subtítulo opcional')`), pero sólo en descripciones y campos de valores.

## Límites de un Embed

Hay algunos límites a tener en cuenta en la planificación de tu embed, debido a las limitaciones de la API. Aquí hay una rápida referencia a la que puedes volver:

- Títulos de Embed se limitan a 256 caracteres.
- Descripciones de Embed se limitan a 4096 caracteres.
- Pueden haber hasta 25 campos.
- El nombre de un campo y sus valores se limitan a 256 y 1024 caracteres, respectivamente.
- El pie de texto se limita a 2048 caracteres.
- El nombre del autor se limita a 256 caracteres.
- La suma de todos los caracteres de toda las estructuras de Embed en un mensaje no pueden exceder los 6000 caracteres.
- Se pueden enviar hasta 10 Embeds por mensaje.

Fuente: [Documentación Discord API](https://discord.com/developers/docs/resources/channel#embed-limits)
