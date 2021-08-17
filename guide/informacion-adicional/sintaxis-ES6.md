# Ejemplos de sintax ES6

Si has usado JavaScript por una pequeña cantidad de tiempo, o no tienes mucha experiencia con el, probablemente no sepas qué es ES6 y los beneficios que incluye. Como esta es una guía especialmente para bots de Discord, estaremos usando código de discord.js como ejemplo de lo que podría tener frente a lo que podría hacer para beneficiarse de ES6.

Aquí está el código que usaremos como base:

<!-- eslint-disable prefer-template -->
<!-- eslint-disable prefer-destructuring -->

```js
const { Client, Intents } = require('discord.js');
const config = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') {
		interaction.reply('Pong.');
	} else if (commandName === 'beep') {
		interaction.reply('Boop.');
	} else if (commandName === 'server') {
		interaction.reply('Nombre del servidor: ' + interaction.guild.name + '\nMiembros totales: ' + interaction.guild.memberCount);
	} else if (commandName === 'user-info') {
		interaction.reply('Tu nombre de usuario: ' + interaction.user.username + '\nTu Id: ' + interaction.user.id);
	}
});

client.login(config.token);
```

Si no te has dado cuenta, ¡Este pedazo de código ya está usando un poco de ES6! La palabra clave `const` y la declaración de la función flecha (`() => ...`) es sintaxis ES6, y recomendamos usarla siempre que sea posible.

En cuanto al código anterior, hay algunos puntos que se pueden mejorar. Vamos a verlos.

## Literales de plantilla

Si revisas el código anterior, está haciendo cosas como `'Nombre del servidor: ' + interaction.guild.name` y `'Tu nombre de usuario: ' + interaction.user.username`, lo cual es perfectamente válido. Sin embargo, es un poco difícil de leer y no es demasiado divertido escribirlo constantemente. Afortunadamente, hay una mejor alternativa.

<!-- eslint-skip -->

```js
// Versión ES5, tal y como lo tenemos actualmente
else if (commandName === 'server') {
	interaction.reply('Nombre del servidor: ' + interaction.guild.name + '\nMiembros totales: ' + interaction.guild.memberCount);
}
else if (commandName === 'user-info') {
	interaction.reply('Tu nombre de usuario: ' + interaction.user.username + '\nTu Id: ' + interaction.user.id);
}
```

<!-- eslint-skip -->

```js
// Versión ES6, usando literales de plantilla
else if (commandName === 'server') {
	interaction.reply(`Nombre del servidor: ${interaction.guild.name}\nMiembros totales: ${interaction.guild.memberCount}`);
}
else if (commandName === 'user-info') {
	interaction.reply(`Tu nombre de usuario: ${interaction.user.username}\nTu Id: ${interaction.user.id}`);
}
```

¡Fácil de leer y escribir! Lo mejor de ambos mundos.

### Literales de plantilla contra concatenación de cadenas de texto

Si has usado otros lenguajes de programación, deberías estar familiarizado con el término "interpolación de cadenas de texto". Los literales de plantilla son la implementación de JavaScript de la interpolación de cadenas de texto. Si estás familiarizado con sintaxis heredoc, es muy parecido; te permite la interpolación de cadenas de texto, al igual que hacer cadenas de texto multi-líneas.

El siguiente ejemplo no entrará mucho en detalles, pero si estás interesado en saber más, puedes leer [la documentación de MDN](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals).

```js
// variables/función usada a través de los ejemplos
const username = 'Kirzu';
const password = 'nomehackeesporfavor';

function letsPretendThisDoesSomething() {
	return 'Yay, datos de muestra';
}
```

<!-- eslint-disable prefer-template -->

```js
// concatenación de cadenas de texto regular
console.log('Tu nombre de usuario es: **' + username + '**.');
console.log('Tu contraseña es: **' + password + '**.');

console.log('1 + 1 = ' + (1 + 1));

console.log('Y aquí tenemos la llamada a la función: ' + letsPretendThisDoesSomething());

console.log('Agregar cadenas de texto en nuevas líneas\n'
	+ 'puede ser algo doloroso\n'
	+ 'con concatenación de cadenas de texto. :(');
```

```js
// literales de plantilla
console.log(`Tu nombre de usuario es: **${username}**.`);
console.log(`Tu contraseña es: **${password}**.`);

console.log(`1 + 1 = ${1 + 1}`);

console.log(`Y aquí tenemos la llamada a la función: ${letsPretendThisDoesSomething()}`);

console.log(`
	¡Agregar cadenas de texto en una nueva línea
	es encantador
	con literales de plantilla! :)
`);

// NOTA: los literales de plantilla también muestran la identación dentro de ellos.
// hay formas de evitarlo que discutiremos en otra sección.
```

Puedes ver como hace las cosas más fáciles y legíbles. En algunos casos, ¡Puede hacer tu código más corto! Esto es algo que querrás aprovechar al máximo.

## Funciones flecha

Las funciones flecha son una abreviatura de las funciones normales, con el añadido de que utilizan un contexto léxico `this` dentro del suyo propio. Si no sabes a qué se refiere la palabra clave `this`, no te preocupes; aprenderás más sobre ella a medida que avances.

Estos son algunos ejemplos de cómo puedes beneficiarte de las funciones flecha sobre las funciones normales:

<!-- eslint-disable func-names, no-var, prefer-arrow-callback, prefer-template -->

```js
// funciones normales, ES5 completo
client.once('ready', function() {
	console.log('¡Estoy listo!');
});

client.on('typingStart', function(channel, user) {
	console.log(user + ' comenzó a escribir en ' + channel);
});

client.on('messageCreate', function(message) {
	console.log(message.author + ' envió el mensaje: ' + message.content);
});

client.on('interactionCreate', function(interaction) {
	console.log(interaction.user + ' ejecutó una interacción en ' + interaction.channel);
});

var doubleAge = function(age) {
	return 'Tu edad duplicada es: ' + (age * 2);
};

// dentro de un collector de componentes
var filter = function(i) {
	return i.isButton() && !i.user.bot;
};

var collector = message.createMessageComponentCollector({ filter, time: 15000 });
```

```js
// funciones flecha, ES6 completo
client.once('ready', () => console.log('¡Estoy listo!'));

client.on('typingStart', (channel, user) => console.log(`${user} comenzó a escribir en ${channel}`));

client.on('messageCreate', message => console.log(`${message.author} envió el mensaje: ${message.content}`));

client.on('interactionCreate', interaction => console.log(`${interaction.user} ejecutó una interacción en: ${interaction.channel}`));

const doubleAge = age => `Tu edad duplicada es: ${age * 2}`;

// dentro de un collector de componentes
const filter = i => i.isButton() && !i.user.bot;
const collector = message.createMessageComponentCollector({ filter, time: 15000 });
```

Hay algunas cosas importantes que debes notar aquí:

* Los paréntesis alrededor de los parámetros de la función son opcionales cuando tienes un solo parámetro, pero obligatorios si tienes más de uno. Si sientes que esto te confunde, es buena idea usar siempre los paréntesis. 
* Puedes poner limpiamente lo que necesites en una sola línea sin las llaves (`{ }`).
* Omitir las llaves (`{ }`) hará que las funciones flecha usen un **return implícito**, pero solo si tienes una expresión de una sola línea. Las variables `doubleAge` y `filter` son un buen ejemplo de esto.
* A diferencia de la declaración `function someFunc() { ... }`, las funciones flecha no pueden utilizarse para crear funciones con esa sintaxis. Sin embargo, puedes crear una variable y darle una función flecha anónima como valor (Como se ha visto con las variables `doubleAge` y `filter`).

No hablaremos sobre el ámbito léxico `this` con funciones flecha aquí, pero puedes [Googlear](https://google.com) sobre eso si tienes curiosidad. Nuevamente, si no estás seguro sobre qué es `this` o cuándo lo necesitarás, leer sobre el léxico `this` primero solamente te confundirá.

## Desestructuración

La desestructuración es una forma fácil de extraer elementos de un objeto o una matriz. Si nunca has visto la sintaxis antes, puede ser algo confusa, ¡Pero es sencillo de entender una vez explicado!

### Desestructuración de objetos

Aquí hay un ejemplo común en el cual la desestructuración de objetos sería muy útil:

<!-- eslint-skip -->

```js
const config = require('./config.json');
const prefix = config.prefix;
const token = config.token;
```

Este código es un poco verboso y no es divertido escribirlo a cada rato. La desestructuración de objetos lo simplifica, facilitando tanto la lectura como la escritura. Echa un vistazo:

```js
const { prefix, token } = require('./config.json');
```

La desestructuración de objetos toma esas propiedades del objeto y las almacena en variables. Si la propiedad no existe, seguirá creando una variable pero con el valor de `undefined`. Así que en lugar de usar `config.token` en tu método `client.login()`, simplemente usarías `token`. Y como la desestructuración crea una variable para cada elemento, no necesitas la línea `const prefix = config.prefix`.

Adicionalmente, puedes usar esto para tus comandos.

```js
client.on('interactionCreate', interaction => {
	const { commandName } = interaction;

	if (commandName === 'ping') {
		// comando ping aquí...
	} else if (commandName === 'beep') {
		// comando beep aquí...
	}
	// otros comandos aquí...
});
```

El código es corto y limpio, pero no sería necesario si sigues la sección de [gestor de comandos](/gestor-de-comandos/) de la guía.

También puedes renombrar las variables al desestructurar, si es necesario. Un buen ejemplo de esto es cuando estás usando una propiedad con un nombre que ya es usado, o entra en conflicto con una palabra clave reservada. La sintaxis es la siguiente:

```js
// 'default' es una palabra clave reservada
const { 'default': defaultValue } = someObject;

console.log(defaultValue);
// 'Algún valor pre-definido aquí'
```

### Desestructuración de matricez

La sintaxis de desestructuración de matrices es bastante similar a la desestructuración de objetos, excepto que usas corchetes en lugar de llaves. En adición, ya que estás usando una matriz, la desestructuración de elementos será en el mismo orden en el que está la matriz. Sin desestructurar la matriz, así sería como extraerías un elemento de la matriz:

```js
// asumiendo que estamos en un comando 'profile' y tenemos una variable 'args'
const name = args[0];
const age = args[1];
const location = args[2];
```

Como en el primer ejemplo de desestructuración de objetos, esto es algo verboso y no es divertido de escribir. La desestructuración de matrices alivia este dolor.

```js
const [name, age, location] = args;
```

¡Una sola línea de código que hace las cosas mucho más limpias! En algunos casos, no necesitarás todos los elementos de la matriz (e.j., cuando usas `string.match(regex)`). La desestructuración de matrices sigue permitiendo operar en el mismo sentido.

```js
const [, username, id] = message.content.match(someRegex);
```

En este fragmento de código, usamos una coma sin dar un nombre al elemento de la matriz que no necesitamos. También puedes darle un nombre como marcador si lo deseas, claro; todo depende de tus preferencias en este punto.

## var, let, y const

Como hay muchos, muchos artículos que explican esto más en profundidad, solamente te daremos mucho texto y un enlace a un artículo si eliges leer más sobre esto.

1. La palabra clave `var` es lo que fue (y sigue siendo) usado en JavaScript antes de que aparecieran `let` y `const`. Sin embargo, hay muchos problemas con `var`, como el hecho de que sea de ámbito funcional (`function`), problemas relacionados con la elevación (`hoisting`) y la posibilidad de redeclaración.
2. La palabra clave `let` es esencialmente la nueva `var`; aborda muchos de los problemas que tiene `var`, pero su factor más significativo sería que es de ámbito de bloques y no permite la redeclaración (*no* la reasignación).
3. La palabra clave `const` sirve para dar a las variables un valor constante que no puede ser reasignado. La palabra `const`, al igual que `let`, también está limitada por bloques.

La regla general recomendada por esta guía es utilizar `const` siempre que sea posible, `let` en caso contrario, y evitar el uso de `var`. Aquí hay un [artículo útil](https://madhatted.com/2016/1/25/let-it-be) si quieres leer más sobre este te