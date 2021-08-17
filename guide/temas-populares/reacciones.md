<style scoped>
.emoji-container {
	display: inline-block;
}

.emoji-container .emoji-image {
	width: 1.375rem;
	height: 1.375rem;
	vertical-align: bottom;
}
</style>

# Reacciones

## Reaccionando a mensajes

Una de las primeras cosas que las personas desearía saber es el como reaccionar con emojis, con emojis personalizados y "regulares" (Unicode). Hay diferentes rutas que debe tomar para cada uno de ellos, así que veamos ambos.

Este es el código base que estaremos usando:

```js
const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});

client.once('ready', () => {
	console.log('¡Listo!');
});

client.on('interactionCreate', interaction => {
	// ...
});

client.login('tu-token-va-aquí');
```

### Emojis Unicode

Para reaccionar con un emoji Unicode, necesitaras el carácter Unicode del emoji correspondientes, hay diversas maneras de obtener el carácter Unicode de un emoji, pero la más fácil o recomendada seria obtenerlos a partir de Discord. Si envías un mensaje con un emoji Unicode (por ejemplo, `:smile:`) y escribes un `\` antes del emoji, el emoji será "desprocesado" por su carácter Unicode en lugar de la imagen estándar del emoji.

<DiscordMessages>
	<DiscordMessage profile="user">
		Emoji Unicode:
		<span class="emoji-container">
			<img class="emoji-image" title="smile" src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f604.png" alt="" />
		</span>
		<br />
		Versión sin procesar (<DiscordMarkdown>`\:smile:`</DiscordMarkdown>): 😄
	</DiscordMessage>
</DiscordMessages>

Para reaccionar con un emoji, necesitaras usar el método `message.react()`. Cuando ya tengas el carácter del emoji, lo único que debes de hacer es copiar y pegar como un string dentro del método `.react()`.

```js {6-9}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'reaccionar') {
		const message = await interaction.reply('¡Puedes reaccionar con emojis Unicode!', { fetchReply: true });
		message.react('😄');
	}
});
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>react</DiscordInteraction>
		</template>
		¡Puedes reaccionar con emojis Unicode!
		<template #reactions>
			<DiscordReactions>
				<DiscordReaction name="smile" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f604.png" />
			</DiscordReactions>
		</template>
	</DiscordMessage>
</DiscordMessages>

### Emojis personalizados

Para los emojis personalizados, hay múltiples maneras de reaccionar. Como los emojis Unicode, puedes desprocesar los emojis personalizados. Sin embargo, cuando desprocesas un emoji personalizado, el resultado será diferente.

<DiscordMessages>
	<DiscordMessage profile="user">
		Emoji personalizado:
		<span class="emoji-container">
			<img class="emoji-image" title="blobreach" src="https://imgur.com/3Oar9gP.png" alt="" />
		</span>
		<br />
		Versión sin procesar (<DiscordMarkdown>`\:blobreach:`</DiscordMarkdown>): &lt;:blobreach:123456789012345678&gt;
	</DiscordMessage>
</DiscordMessages>

El formato es formado por el nombre del emoji, seguido por su ID. Copia y pega la ID dentro del método `.react()` como un string.

```js {6-9}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'reaccion-perzonalizada') {
		const message = await interaction.reply('¡Puedes reaccionar con emojis personalizados!', { fetchReply: true });
		message.react('123456789012345678');
	}
});
```

::: tip
También puedes usar diferentes formatos del emoji en el método `.react()`.

```js
message.react('<:blobreach:123456789012345678>');
message.react('blobreach:123456789012345678');
message.react('<a:blobreach:123456789012345678>');
message.react('a:blobreach:123456789012345678');
```
:::

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>react-custom</DiscordInteraction>
		</template>
		¡Puedes reaccionar con emojis personalizados!
		<template #reactions>
			<DiscordReactions>
				<DiscordReaction name="blobreach" image="https://imgur.com/3Oar9gP.png" />
			</DiscordReactions>
		</template>
	</DiscordMessage>
</DiscordMessages>

¡Genial! Es posible que esta ruta no siempre esté disponible para usted. A veces tendrás que reaccionar con un emoji de forma programática. Para hacerlo, deberá recuperar el objeto emoji.

Las dos formas más fáciles se obtener un emoji serían

* Usa `.find()` en una colección de emojis.
* Usa `.get()` en la colección de `client.emojis.cache`.

::: tip
Dos o más emojis pueden tener el mismo nombre, y usando `.find()` únicamente devolverá la **primera** entrada que encuentre. Por lo tanto, esto puede tener respuestas inesperadas.
:::

Usando `.find()`, tu código debería verse algo así:

<!-- eslint-skip -->

```js {3-4}
if (commandName === 'reaccion-personalizada') {
	const message = await interaction.reply('¡Puedes reaccionar con emojis personalizados!', { fetchReply: true });
	const reactionEmoji = message.guild.emojis.cache.find(emoji => emoji.name === 'blobreach');
	message.react(reactionEmoji);
}
```

Usando `.get()`, tu código debería verse algo así:

<!-- eslint-skip -->

```js {3-4}
if (commandName === 'reaccion-personalizada') {
	const message = await interaction.reply('¡Puedes reaccionar con emojis personalizados!', { fetchReply: true });
	const reactionEmoji = client.emojis.cache.get('123456789012345678');
	message.react(reactionEmoji);
}
```

Claro, si tú ya tienes la ID del emoji, deberías ponerla directamente dentro del método `.react()`. Pero si quieres hacer otras cosas con los datos de emoji más adelante (p. ej., mostrar el nombre o la URL de la imagen), es mejor recuperar el objeto emoji completo.

### Reaccionando en orden

Si tu pones un `message.react()` debajo de otro, no siempre reaccionara en el orden que se escribió. Porque `.react()` es una promesa y una operación asincrónica.

```js {6-12}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'frutas') {
		interaction.reply('¡Reaccionando con frutas!');
		const message = await interaction.fetchReply();
		message.react('🍎');
		message.react('🍊');
		message.react('🍇');
	}
});
```

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>fruits</DiscordInteraction>
		</template>
		¡Reaccionando con frutas!
		<template #reactions>
			<DiscordReactions>
				<DiscordReaction name="apple" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34e.png" />
				<DiscordReaction name="tangerine" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34a.png" />
				<DiscordReaction name="grapes" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f347.png" />
			</DiscordReactions>
		</template>
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>fruits</DiscordInteraction>
		</template>
		¡Reaccionando con frutas!
		<template #reactions>
			<DiscordReactions>
				<DiscordReaction name="apple" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34e.png" />
				<DiscordReaction name="grapes" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f347.png" />
				<DiscordReaction name="tangerine" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34a.png" />
			</DiscordReactions>
		</template>
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>fruits</DiscordInteraction>
		</template>
		¡Reaccionando con frutas!
		<template #reactions>
			<DiscordReactions>
				<DiscordReaction name="tangerine" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34a.png" />
				<DiscordReaction name="apple" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34e.png" />
				<DiscordReaction name="grapes" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f347.png" />
			</DiscordReactions>
		</template>
	</DiscordMessage>
</DiscordMessages>

Como puedes ver, si tú lo dejas tal cual, no se mostrará como deseas. Pudo reaccionar correctamente en el primero intento, pero reacciono durante diferentes tiempos luego de eso.

Afortunadamente, hay dos soluciones sencillas para esto. La primera sería crear una cadena de `.then()`s en el orden en el cual quieras que se muestre.

```js {8-11}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'frutas') {
		const message = await interaction.reply('¡Reaccionando con frutas!', { fetchReply: true });
		message.react('🍎')
			.then(() => message.react('🍊'))
			.then(() => message.react('🍇'))
			.catch(error => console.error('Uno de los emojis fallo al intentar reaccionar:', error));
	}
});
```

La otra solución, sería usar las palabras claves `async`/`await`.
The other would be to use the `async`/`await` keywords.

```js {9-15}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'frutas') {
		const message = await interaction.reply('¡Reaccionando con frutas!', { fetchReply: true });

		try {
			await message.react('🍎');
			await message.react('🍊');
			await message.react('🍇');
		} catch (error) {
			console.error('Uno de los emojis fallo al intentar reaccionar:', error);
		}
	}
});
```

So vuelves a intentarlo con los bloques de código anteriores, obtendrás el resultado deseado.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>fruits</DiscordInteraction>
		</template>
		¡Reaccionando con frutas!
		<template #reactions>
			<DiscordReactions>
				<DiscordReaction name="apple" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34e.png" />
				<DiscordReaction name="tangerine" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34a.png" />
				<DiscordReaction name="grapes" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f347.png" />
			</DiscordReactions>
		</template>
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>fruits</DiscordInteraction>
		</template>
		¡Reaccionando con frutas!
		<template #reactions>
			<DiscordReactions>
				<DiscordReaction name="apple" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34e.png" />
				<DiscordReaction name="tangerine" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34a.png" />
				<DiscordReaction name="grapes" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f347.png" />
			</DiscordReactions>
		</template>
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>fruits</DiscordInteraction>
		</template>
		¡Reaccionando con frutas!
		<template #reactions>
			<DiscordReactions>
				<DiscordReaction name="apple" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34e.png" />
				<DiscordReaction name="tangerine" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f34a.png" />
				<DiscordReaction name="grapes" image="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f347.png" />
			</DiscordReactions>
		</template>
	</DiscordMessage>
</DiscordMessages>

::: tip
Si no estas familiarizado con las promesas `async`/`await`, puedes leer más sobre estas en [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) o [nuestra página en la guía sobre async/await](/additional-info/async-await.md)!
:::

### Manejando múltiples reacciones si el orden no importa

Sin embargo, si no te importa el orden en el cual las reacciones se efectúan, puedes tomar provecho de `Promise.all()`, así:

<!-- eslint-skip -->

```js {3-8}
if (commandName === 'frutas') {
	const message = await interaction.reply('¡Reaccionando con frutas!', { fetchReply: true });
	Promise.all([
		message.react('🍎'),
		message.react('🍊'),
		message.react('🍇'),
	])
		.catch(error => console.error('Uno de los emojis fallo al intentar reaccionar:', error));
}
```

Esta pequeña optimización te permite usar `.then()` para manejar cuando todos las promesas fueron resueltas, o `.catch()` cuando una falla. También puedes usar `await` ya que devuelve una Promesa en sí.

## Removiendo reacciones

Ahora que sabes cómo agregar reacciones, es posible que te estés preguntando, ¿cómo las eliminan? En esta sección, aprenderás cómo eliminar todas las reacciones, eliminar las reacciones por usuario y eliminar las reacciones por emoji.

::: warning ADVERTENCIA
Todos estos métodos requieren el permiso `MANAGE_MESSAGES`. Asegúrate que tu bot tenga este permiso antes de intentar utilizar cualquiera de estos métodos, ya que se producirá un error si no lo haces.
:::

### Removiendo todas las reacciones

Remover todas las reacciones de un mensaje es lo más fácil, la API te permite hacer esto con una sola llamada. Puede ser hecho usando el método `message.reactions.removeAll()`.

```js
message.reactions.removeAll()
	.catch(error => console.error('Ocurrió un error al intentar eliminar las reacciones:', error));
```

### Removiendo reacciones por emoji

Remover reacciones por emoji es fácilmente hecho usando <DocsLink path="class/MessageReaction?scrollTo=remove" type="method" /.

```js
message.reactions.cache.get('123456789012345678').remove()
	.catch(error => console.error('Ocurrió un error al intentar eliminar las reacciones:', error));
```

### Removiendo reacciones por usuario

::: tip
Si no estas familiarizado con <DocsLink section="collection" path="class/Collection?scrollTo=filter" type="method" /> y [`Map.has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has) tomate el tiempo de comprender que hace cada uno y vuelve luego.
:::

Eliminar las reacciones de un usuario no es tan sencillo como eliminar con un emoji o eliminar todas las reacciones. La API no nos da un método para remover las reacciones un usuario en específico. Esto significa que tendrás que iterar a través de reacciones que incluyan al usuario y removerlas.

<!-- eslint-skip -->

```js
const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(userId));

try {
	for (const reaction of userReactions.values()) {
		await reaction.users.remove(userId);
	}
} catch (error) {
	console.error('Ocurrió un error al intentar eliminar las reacciones:');
}
```

::: warning ADVERTENCIA
Estate seguro de no remover reacciones por emojis o por usuario demasiado; si hay muchas reacciones o usuarios, puede ser considerado un spam de la API.
:::

## Esperando reacciones

Un caso de uso común para las reacciones en los comandos es hacer que un usuario confirme o niegue una acción o cree un sistema de votación. Afortunadamente, nosotros actualmente [tenemos una guía que cubre este punto](/temas-populares/recolectores.md)! Revisa esa página si quieres ir mas a profundidad con la explicación. De otra manera, aquí hay un ejemplo básico para que tomes de referencia.

```js
message.react('👍').then(() => message.react('👎'));

const filter = (reaction, user) => {
	return ['👍', '👎'].includes(reaction.emoji.name) && user.id === interaction.user.id;
};

message.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
	.then(collected => {
		const reaction = collected.first();

		if (reaction.emoji.name === '👍') {
			message.reply('Reaccionaste con un pulgar hacia arriba.');
		} else {
			message.reply('Reaccionaste con un pulgar hacia abajo.');
		}
	})
	.catch(collected => {
		message.reply('No reaccionaste con un pulgar hacia arriba ni hacia abajo.');
	});
```

## Escuchar las reacciones de los mensajes antiguos.

Los mensajes enviados antes de que se iniciara tu bot no se almacenan en caché a menos que los recuperes primero. Por defecto, la librería no emite eventos de cliente si los datos recibidos y almacenados en el cache no son suficientes para construir un objeto completo y funcional.
Desde la versión 12, puede cambiar este comportamiento activando parciales. Para obtener una explicación completa de los parciales, consulta [está página](/temas-populares/parciales.md).

Asegúrese de habilitar estructuras parciales para `MESSAGE`, `CHANNEL`, y `REACTION` al crear una instancia de tu cliente si desea eventos de reacción en mensajes no almacenados en caché tanto para el servidor como para los canales de mensajes directos. Si no desea admitir canales de mensajes directos, puedes excluir `CHANNEL`.

::: tip
Si usas [intents del gateway](/temas-populares/intents.md) pero no puedes o no quieres usar el intent `GUILD_PRESENCES`, además necesita el parcial `USER`.
:::
A
```js
const { Client, Intents } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.on('messageReactionAdd', async (reaction, user) => {
	// Cuando una reacción es recibida, revisa si la estructura es parcial
	if (reaction.partial) {
		// Si se eliminó el mensaje al que pertenece esta reacción, la búsqueda puede dar como resultado un error de API que debe manejarse
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Algo salió mal al recuperar el mensaje:', error);
			// Devuelve como que `reaction.message.author` es undefined/null
			return;
		}
	}

	// Ahora el mensaje se ha almacenado en caché y está completamente disponible
	console.log(`El mensaje de ${reaction.message.author}'s con el contenido: "${reaction.message.content}" ganó una reacción!`);
	// La reacción ahora también está completamente disponible y las propiedades se reflejarán con precisión:
	console.log(`¡${reaction.count} usuario(s) han dado la misma reacción al mensaje!`);
});
```

::: warning ADVERTENCIA
Las estructuras parciales están habilitadas globalmente. No solo puedes hacer que funcionen para un evento o caché específico, y es muy probable que necesites adaptar otras partes de tu código que acceden a datos de los cachés relevantes. ¡Todos los cachés que contienen el tipo de estructura respectivo también pueden devolver parciales! Para obtener más información, consulte [esta página] (/temas-populares/parciales.md).
:::

## Código resultante

<ResultingCode />
