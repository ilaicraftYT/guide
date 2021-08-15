# Añadiendo más comandos

::: tip
Esta página es una continuación y se basa en el código de la [página anterior](/creating-your-bot/) y asume que ya has leído la [sección de interacciones](/interactions/registering-slash-commands.md) y estás familiarizado con su uso.
:::

Un bot sin un solo comando puede ser aburrido, y probablemente tienes muchísimas ideas para comandos flotando alrededor de tu cabeza, ¿No? Empecemos entonces. 

Así se debería ver tu evento de interacciones:

```js
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('¡Pong!');
	}
});
```

Antes de hacer cualquier cosa, asegúrate de crear una propiedad para almacenar el token. En vez de `const config = ...`, puedes desestructurar el archivo de configuración para extraer la variable `token`.

```js {1,3}
const { token } = require('./config.json');
// ...
client.login(token);
```

Desde ahora, si cambias el token en tu archivo `config.json`, se cambiará en el archivo de tu bot igualmente.

::: tip
Si no estás familiarizado con parte de esta sintaxis, es posible que sea sintaxis ES6. Si esto te confunde, deberías revisar [esta página](/additional-info/es6-syntax.md) de la guía antes de continuar.
:::

## Estructura simple de comandos

Ya tienes un if declarado que comprueba mensajes por un comando ping/pong. Añadir comprobaciones para otros comandos es fácil; encadena un `else if` a tu condición existente. En vez de usar `interaction.commandName` a cada rato, puedes desestructurar y renombrarlo a `command`.

```js {2-10}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName: command } = interaction;

	if (command === 'ping') {
		await interaction.reply('¡Pong!');
	} else if (command === 'beep') {
		await interaction.reply('¡Boop!');
	}
});
```

## Mostrando datos reales

Empecemos con mostrar algunos datos reales. Por ahora, mostraremos información básica de un miembro/servidor.

### Comando de información del servidor

Declara otro if para comprobar comandos con el nombre `server`. Obtén el objeto de la interacción y responde al igual que antes.

::: tip
Los servidores son llamados "guilds" en la API de Discord y en la librería discord.js. Siempre que veas algo que diga "guild", significará servidor.
:::

```js {10-12}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName: command } = interaction;

	if (command === 'ping') {
		await interaction.reply('¡Pong!');
	} else if (command === 'beep') {
		await interaction.reply('¡Boop!');
	} else if (command === 'server') {
		await interaction.reply(`El nombre de este servidor es: ${interaction.guild.name}`);
	}
});
```

El resultado del código de arriba sería este:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">server</DiscordInteraction>
		</template>
		El nombre de este servidor es: Discord Bot Guide
	</DiscordMessage>
</DiscordMessages>

Si quieres expandir más ese comando y añadir algo más de información, aquí hay un ejemplo de qué puedes hacer:

```js {10-12}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName: command } = interaction;

	if (command === 'ping') {
		await interaction.reply('¡Pong!');
	} else if (command === 'beep') {
		await interaction.reply('¡Boop!');
	} else if (command === 'server') {
		await interaction.reply(`Nombre del servidor: ${interaction.guild.name}\nMiembros totales: ${interaction.guild.memberCount}`);
	}
});
```

Esto mostrará el nombre del servidor y la cantidad de miembros en el.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">server</DiscordInteraction>
		</template>
		Nombre del servidor: Discord Bot Guide<br>
		Miembros totales: 3
	</DiscordMessage>
</DiscordMessages>

Claro, puedes modificar esto a tu gusto. Puede que también quieras mostrar la fecha en la que se creó el servidor. Puedes hacerlo de la misma manera, usando `interaction.guild.createdAt`.

::: tip
¿Quieres ver una lista de todos los métodos y propiedades de un servidor a los que puedes acceder? ¡Revisa la <DocsLink path="class/Guild">documentación de discord.js</DocsLink>!
:::

### Comando de información del usuario

Declara otro if con el comando `user-info`.

<!-- eslint-skip -->

```js {12-14}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName: command } = interaction;

	if (command === 'ping') {
		await interaction.reply('¡Pong!');
	} else if (command === 'beep') {
		await interaction.reply('¡Boop!');
	} else if (command === 'server') {
		await interaction.reply(`El nombre de este servidor es: ${interaction.guild.name}`);
	} else if (command === 'user-info') {
		await interaction.reply(`Tu nombre de usuario: ${interaction.user.username}\nTu Id: ${interaction.user.id}`);
	}
});
```

Esto mostrará el **nombre de usuario** del autor del comando (no el apodo, si tiene uno establecido), y su Id.

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction profile="user" :command="true">user-info</DiscordInteraction>
		</template>
		Tu nombre de usuario: User <br>
		Tu Id: 123456789012345678
	</DiscordMessage>
</DiscordMessages>

::: tip
`interaction.user` se refiere al usuario que envió el comando. Para una lista completa de todas las propiedades y métodos que puedes usar de un usuario, revisa <DocsLink path="class/User">la documentación</DocsLink>.
:::

¡Y ahí lo tienes! Como puedes ver, es bastante simple agregar comandos adicionales.

## El problema con `if`/`else if`

Si no tienes planeado hacer más de siete u ocho comandos para tu bot, entonces usar una cadena de if/else if es suficiente; es presumiblemente un proyecto pequeño en ese punto, por lo que no necesitarías dedicarle mucho tiempo a eso. Sin embargo, este no es el caso para la mayoría de nosotros.

Probablemente quieras hacer tu bot con diversas funciones, fácil de configurar y desarrollar, ¿No? Usar una cadena de muchos if/else if no te ayudará a lograr eso; solo te molestará durante el proceso de desarrollo. En la siguiente página los dividiremos en algo llamado "administrador de comandos". Algo que hace la gestión de comandos más fácil y mucho más eficiente.

Antes de continuar, aquí hay una pequeña lista de razones por las que no deberías usar cadenas de if/else if para algo que no sea un proyecto pequeño:

* Toma más tiempo encontrar una pieza de código que busques.
* Fácil de caer como víctima del [código espagueti](https://es.wikipedia.org/wiki/Código_espagueti).
* Se dificulta más el mantenerlo mientras crece-
* Se dificulta debuggearlo.
* Se dificulta organizar.
* Mala práctica en general.

En resumen, no es una buena idea. ¡Pero esa es la razón por la que esta guía existe! Lee las siguientes páginas para prevenir estos problemas antes de que sucedan, aprende nuevas cosas durante el camino.

## Resultado final

<ResultingCode />
