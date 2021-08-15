# Administrador de eventos

Node.js usa una arquitectura basada en eventos, haciendo posible el ejecutar código cuando un evento específico ocurre. La librería discord.js aprovecha esto al máximo. Puedes visitar <DocsLink path="class/Client">la documentación</DocsLink> para ver una lista de todos los eventos que tiene `Client`.

Esta es la base del código que usaremos:

```js
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('ready', () => {
	console.log('¡Estoy listo!');
});

client.on('interactionCreate', interaction => {
	console.log(`${interaction.user.tag} ejecutó una interacción en #${interaction.channel.name}.`);
});

client.login(token);
```

Actualmente, los eventos están en el archivo `index.js`. El evento `ready` se emite una sola vez cuando `Client` está listo para su uso, y el evento `interactionCreate` se emite siempre que una interacción sea recibida. Mover el código de los eventos a archivos individuales es simple, y vamos a adoptar un enfoque similar al del [administrador de comandos](/command-handling/).

## Archivos individuales para eventos

La estructura completa de tu carpeta debería verse algo así: 

```:no-line-numbers
bot-de-discord/
├── node_modules
├── config.json
├── index.js
├── package-lock.json
└── package.json
```

En la misma carpeta, crea una nueva carpeta llamada `events`. Ahora puedes tomar el código de tus eventos en `index.js` y ponerlos en archivos individuales dentro de la carpeta `events`. Crea los archivos `ready.js` y `interactionCreate.js` dentro de la carpeta `events` y pon el código en sus respectivos archivos:

```js
// ready.js
module.exports = (client) => {
	console.log('¡Estoy listo! Mi nombre es:', client.user.tag);
}
```

```js
// interactionCreate.js
module.exports = (client, interaction) => {
	console.log(`${interaction.user.tag} ejecutó una interacción en #${interaction.channel.name}.`);
}
```

::: tip
El nombre del archivo será el nombre que usemos para escuchar nuestros eventos. El nombre debe ser exacto al de un evento, o sino no se emitirá.
:::

Exportamos una función la cual se ejecutará cada vez que se emita el evento. El primer parámetro que recibirá la función será `client`. Este no es un parámetro propio del evento, más adelante veremos como pasar el parámetro `client` aparte de los parámetros del evento. Aparte de `client`, el resto de parámetros son propios del evento que crearás, por ejemplo: El evento `ready` no tiene parámetros propios, así que el único parámetro que tendría sería `client`. El evento `interactionCreate` tiene como parámetro propio el objeto de la interacción, así que sus parámetros serían: `client`, `interaction`.

Ahora, escribirás el código para recibir todos los eventos dentro de la carpeta `events` dinámicamente. Añade esto debajo de la línea del `const client` en el `index.js`:

```js {3}
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
```

Este mismo método es usado en nuestro [administrador de comandos](/command-handling/). El método `fs.readdirSync().filter()` retorna un array de todos los nombres de los archivos en la carpeta especificada y filtra solamente los archivos que sean `.js`, por ejemplo: `['ready.js', 'interactionCreate.js']`.

```js {3-8}
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const eventName = file.split('.').shift();
	const event = require(`./events/${file}`);

	client.on(eventName, event.bind(null, client));
}
```
Para escuchar eventos, debes registrar un event listener. Puedes hacerlo usando el método `on` de una instancia de `EventEmitter`.

::: tip
Puedes aprender más sobre un `EventEmitter` [aquí](https://nodejs.org/api/events.html#events_class_eventemitter).
:::

La clase `Client` en discord.js extiende la clase `EventEmitter`. Por lo tanto, el objeto `client` también tiene el método `on` el cual puedes usar para registrar eventos. Este método toma dos argumentos: El nombre del evento y una función callback.

Luego de esto, escuchar otros eventos es tan fácil como crear un nuevo archivo en la carpeta `events`. El administrador de eventos automáticamente lo obtendrá y registrará cada vez que reinicies tu bot.

Es importante saber que el orden de los parámetros importa. Por ejemplo, el evento `userUpdate` tiene dos parámetros: `oldUser` y `newUser`. Eventos como ese deben ser gestionados de esta forma:

```js {3}
module.exports = (client, oldUser, newUser) => {
	// ...
}
```

Si intentas hacer `(newUser, client, oldUser)`, esto significará que `newUser` es el objeto `client`, `client` es el objeto `oldUser` y `oldUser` es el objeto `newUser`.

## Resultado final

<ResultingCode path="event-handling/file-setup" />
