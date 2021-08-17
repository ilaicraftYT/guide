# Registrando comandos de barra

Discord ofrece a los desarrolladores la opción de crear comandos de barra integrados en el cliente. En esta sección, cubriremos cómo registrar estos comandos usando discord.js.

::: tip
Esta página asume que usa la misma estructura de archivo que nuestro **[administrador de comandos](/gestor-de-comamdos)**. Los scripts proporcionados están hechos para funcionar con esa configuración.

Si ya tiene los comandos de barra configurados para su aplicación y desea aprender cómo responder a ellos, consulte **[la página siguiente](/interacciones/respondiendo-a-comandos-de-barra.md)**.
:::

## Comandos de servidor

Los comandos de aplicación del servidor, solo estan disponibles en el mismo que fueron creados, si su aplicación tiene el `scope` de `applications.commands` autorizado.  

Es esta sección,
In this section, utilizaremos una secuencia de comandos que se puede utilizar junto con el controlador de comandos de barra de [administrador de comandos](/gestor-de-comandos/).

Antes que nada, instala [@discordjs/rest](https://github.com/discordjs/discord.js-modules/blob/main/packages/rest/) y [`discord-api-types`](https://github.com/discordjs/discord-api-types/) ejecutando `npm install @discordjs/rest discord-api-types` en tu terminal.

<!-- eslint-skip -->

```js
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { token } = require('./config.json');
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Place your client and guild ids here
const clientId = '123456789012345678';
const guildId = '876543210987654321';

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Iniciando la actualización de (/) comandos de aplicación');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('(/) Comandos de aplicación recargados con éxito');
	} catch (error) {
		console.error(error);
	}
})();
```

La ejecución de este script registrará todos sus comandos en el servidor cuya identificación se pasó arriba.

## Comandos globales

Los comandos globales de la aplicación estarán disponibles en todos los gremios que tu aplicación tenga el `scope` de `applications.commands` autorizado, así como en los MD.

::: tip
Los comandos globales se almacenan en caché durante una hora. Los nuevos comandos globales se desplegarán lentamente en todos los servidores y solo se garantizará que se actualicen después de una hora. Los comandos del servidor se actualizan instantáneamente. Como tal, le recomendamos que use comandos basados en servidores durante el desarrollo y los publique en comandos globales cuando estén listos para uso público.
:::

Para implementar comandos globales, puede usar el mismo script del [comandos de servidor](#comandos-de-servidor) y ajuste la ruta en el script para `.applicationCommands(clientId)`.

<!-- eslint-skip -->

```js {2}
await rest.put(
	Routes.applicationCommands(clientId),
	{ body: commands },
);
```

## Opciones

Los comandos de la aplicación pueden tener `opciones`. Piense en estas opciones como argumentos de una función. Puede especificarlos como se muestra a continuación:

```js {6-9}
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('echo')
	.setDescription('¡Responde con tu argumento!')
	.addStringOption(option =>
		option.setName('input')
			.setDescription('El argumento a repetir')
			.setRequired(true));
```

Observe cómo se especifica `.setRequired (true)` dentro del generador de opciones. ¡Establecer esto evitará que el usuario envíe el comando sin especificar un valor para esta opción!

## Tipos de opciones

Como se muestra en el ejemplo de opciones anterior, puede especificar el `tipo` de un `ApplicationCommandOption`. A continuación se enumeran todos los valores posibles que puede pasar como `ApplicationCommandOptionType`:

::: tip
El [constructor de comandos de barra](/temas-populares/constructores.html#slash-command-builders) tiene un método para cada uno de estos tipos, respectivamente.
Consulte la documentación de la API de Discord para obtener explicaciones detalladas sobre el [`SUB_COMMAND` y `SUB_COMMAND_GROUP` tipos de opciones](https://discord.com/developers/docs/interactions/application-commands#subcommands-and-subcommand-groups).
:::

* `SUB_COMMAND` establece la opción para que sea un subcomando
* `SUB_COMMAND_GROUP` establece la opción para ser un grupo de subcomando
* `STRING` establece la opción para requerir un valor cadena de texto
* `INTEGER` establece la opción para requerir un valor entero
* `NUMBER` establece la opción para requerir un valor decimal (también conocido como `floating point`)
* `BOOLEAN` establece la opción para requerir un valor booleano
* `USER` establece la opción para requerir un usuario o un `snowflake` como valor
* `CHANNEL` establece la opción para requerir un canal o un `snowflake` como valor
* `ROLE` establece la opción para requerir un rol o un `snowflake` como valor
* `MENTIONABLE` establece la opción para requerir un usuario, rol o `snowflake` como valor

## Elecciones

Los tipos de opción `STRING` y `INTEGER` pueden tener "opciones". Las `elecciones` son un conjunto de valores predeterminados entre los que los usuarios pueden elegir al seleccionar la opción que los contiene.

::: warning ADVERTENCIA
Si especifica `elecciones` para una opción, serán los **únicos** valores válidos que los usuarios pueden elegir.
:::

Especifíquelos usando el método `addChoice()` del generador de comandos de barra:

```js {10-12}
const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
	.setName('gif')
	.setDescription('¡Envía un gif aleatorio!')
	.addStringOption(option =>
		option.setName('categoria')
			.setDescription('La categoría del gif')
			.setRequired(true)
			.addChoice('Gracioso', 'gif_gracioso')
			.addChoice('Meme', 'gif_meme')
			.addChoice('Pelicula', 'gif_pelicula'));
```
