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
				embed-title="Título"
				url="https://discord.js.org/"
				thumbnail="https://i.imgur.com/AfFp7pu.png"
				image="https://i.imgur.com/AfFp7pu.png"
				footer-icon="https://i.imgur.com/AfFp7pu.png"
				timestamp="01/01/2018"
				author-name="Autor"
				author-icon="https://i.imgur.com/AfFp7pu.png"
				author-url="https://discord.js.org/">
				La descripción va aquí
				<template #fields>
					<DiscordEmbedFields>
						<DiscordEmbedField field-title="Título de campo regular">
							Texto
						</DiscordEmbedField>
						<DiscordEmbedField field-title="​">
							​
						</DiscordEmbedField>
						<DiscordEmbedField :inline="true" field-title="Título de campo en línea">
							Texto
						</DiscordEmbedField>
						<DiscordEmbedField :inline="true" field-title="Título de campo en línea">
							Texto
						</DiscordEmbedField>
						<DiscordEmbedField :inline="true" field-title="Título de campo en línea">
							Texto
						</DiscordEmbedField>
					</DiscordEmbedFields>
				</template>
				<template #footer>
					<span>Pie de página</span>
				</template>
			</DiscordEmbed>
		</template>
	</DiscordMessage>
</DiscordMessages>

## Usar el contructor de embeds

discord.js cuenta con la utilidad <DocsLink path="class/MessageEmbed" /> para una construcción y manipulación sencilla de embeds.

```js
// arriba de tu archivo
const { MessageEmbed } = require('discord.js');

// dentro de un comando, audiencia de evento, etc.
const exampleEmbed = new MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Título')
	.setURL('https://discord.js.org/')
	.setAuthor('Autor', 'https://i.imgur.com/AfFp7pu.png', 'https://discord.js.org')
	.setDescription('La descripción va aquí')
	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: 'Título de campo regular', value: 'Texto' },
		{ name: '\u200B', value: '\u200B' },
		{ name: 'Título de campo en línea', value: 'Texto', inline: true },
		{ name: 'Título de campo en línea', value: 'Texto', inline: true },
	)
	.addField('Título de campo en línea', 'Texto', true)
	.setImage('https://i.imgur.com/AfFp7pu.png')
	.setTimestamp()
	.setFooter('Pie de página', 'https://i.imgur.com/AfFp7pu.png');

channel.send({ embeds: [exampleEmbed] });
```

::: tip
No es necesario que incluyas todos los elementos mostrados arriba. Si quieres un embed más sencillo, no uses algunos.
:::

La función `.setColor()` acepta un <DocsLink path="typedef/ColorResolvable" /> como por ejemplo datos enteros, cadena de color HEX, una formación de valores RGB, o cadenas de color específicas.

Para añadir un campo vacío a tu embed, puedes usar `.addField('\u200b', '\u200b')`.

El ejemplo de arriba une los métodos de manipulación con el objeto MessageEmbed recién creado.
Si quieres modificar tu embed en base a condiciones, necesitarás referenciarlo como la constante `exampleEmbed` (para nuestro ejemplo).

<!-- eslint-skip -->

```js
const exampleEmbed = new MessageEmbed().setTitle('Un título');

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
		name: 'Autor',
		icon_url: 'https://i.imgur.com/AfFp7pu.png',
		url: 'https://discord.js.org',
	},
	description: 'La descripción va aquí',
	thumbnail: {
		url: 'https://i.imgur.com/AfFp7pu.png',
	},
	fields: [
		{
			name: 'Título de campo regular',
			value: 'Texto',
		},
		{
			name: '\u200b',
			value: '\u200b',
			inline: false,
		},
		{
			name: 'Título de campo en línea',
			value: 'Texto',
			inline: true,
		},
		{
			name: 'Título de campo en línea',
			value: 'Texto',
			inline: true,
		},
		{
			name: 'Título de campo en línea',
			value: 'Texto',
			inline: true,
		},
	],
	image: {
		url: 'https://i.imgur.com/AfFp7pu.png',
	},
	timestamp: new Date(),
	footer: {
		text: 'Un pie de página',
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
const exampleEmbed = { title: 'Título' };

if (message.author.bot) {
	exampleEmbed.color = 0x7289da;
}
```

## Adjuntar imágenes

Puedes subir imágenes junto a tus mensajes incrustados (embedded) y usarlos como fuente para espacios que soporten urls de imágenes, construyendo un <DocsLink path="class/MessageAttachment" /> para que estos se envíen como opción de mensaje junto al embed. El parámetro para adjuntar usa un `BufferResolvable` o `Stream` incluyendo la URL de una imágen externa.

Luego puedes referenciar y usar las imágenes dentro del embed en sí con: `attachment://fileName.extension`.

::: tip
Si planeas adjuntar la misma imágen repetidamente, mejor considera alojarla online y proveer la URL en el respectivo campo de embed. Esto también hace que tu bot responda más rápido, ya que no necesita subir la imagen dependiendo de cada respuesta.
:::

### Usar el constructor MessageEmbed

```js
const { MessageAttachment, MessageEmbed } = require('discord.js');
// ...
const file = new MessageAttachment('../assets/discordjs.png');
const exampleEmbed = new MessageEmbed()
	.setTitle('Título')
	.setImage('attachment://discordjs.png');

channel.send({ embeds: [exampleEmbed], files: [file] });
```

### Usar un objeto embed

```js
const { MessageAttachment } = require('discord.js');
// ...
const file = new MessageAttachment('../assets/discordjs.png');

const exampleEmbed = {
	title: 'Un título',
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

Para direccionar un embed recibido, lo recuperas de la matriz de embeds (`message.embeds`), y lo pasas al MessageEmbed, en donde puede ser editado antes de ser enviado otra vez. 

::: warning ADVERTENCIA
Aquí creamos deliberadamente un nuevo Embed en ves de modificar directamente el `message.embeds[0]`, para mantener el caché válido. Si no hiciéramos esto, el embed con el caché original diferiría de la forma original del Embed; lo que resultaría en comportamiento inadecuado más adelante!
:::

```js
const receivedEmbed = message.embeds[0];
//Creamos un embed nuevo que tiene la misma información y cambiamos el título
const exampleEmbed = new MessageEmbed(receivedEmbed).setTitle('Nuevo título');

channel.send({ embeds: [exampleEmbed] });
```

### Editar el contenido de un mensaje en Embed

Para editar el contenido de un Embed, debes pasar a una nueva estructura MessageEmbed o cambiar el objeto embed a `.edit()`.

```js
const exampleEmbed = new MessageEmbed()
	.setTitle('Un título')
	.setDescription('¡Nueva descripción!');

message.edit({ embeds: [exampleEmbed] });
```

Si quieres construir nuevos datos de Embed a una plantilla de un embed previamente enviado, asegúrate de leer las advertencias de la sección anterior. 

## Notas

- Para mostrar campos lado a lado, necesitar por lo menos dos campos consecutivos ajustados en `inline`
- Los marcadores de horas en el pie de página se ajustan automáticamente a las distintas zonas temporales dependiendo del dispositivo del usuario.
- Menciones de cualquier tipo sólo se mostrarán correctamente en campos con valores y descripciones.
- Las menciones dentro de embeds no notificarán.
- Embeds permiten links enmascarados (ej. `[Guía](https://discordjs.guide/ 'subtítulo opcional')`), pero sólo en descripciones y campos de valores.

## Límites de un Embed

Hay algunos límites a tener en cuenta en la planificación de tu embed, debido a las limitaciones de la API. Aquí hay una rápida referencia a la que puedes volver:

- Títulos de Embed permite hasta 256 caracteres.
- La descripción permite hasta 4096 caracteres.
- Pueden haber hasta 25 campos.
- El nombre de un campo y sus valores permiten hasta 256 y 1024 caracteres, respectivamente.
- El pie de texto permite hasta 2048 caracteres.
- El nombre del autor permite hasta 256 caracteres.
- La suma de todos los caracteres de toda las estructuras de Embed en un mensaje no puede exceder los 6000 caracteres.
- Se pueden enviar hasta 10 embeds por mensaje.

Fuente: [Documentación Discord API](https://discord.com/developers/docs/resources/channel#embed-limits)
