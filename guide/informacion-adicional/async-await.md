# Entendiendo async/await

Si no estas familiarizado con ECMAScript 2017, puede que no sepa acerca de async/await. Es una forma útil de manejar promesas de una manera ambigua. También es un poco mas rápido y aumenta la legibilidad.

## ¿Cómo trabajan las promesas?

Antes de que podamos entrar en async/await, debe saber qué son las promesas y cómo funcionan porque async/await es solo una forma de manejar las promesas. Si sabe qué son las promesas y cómo lidiar con ellas, puede omitir esta parte.  

Las promesas son una forma de manejar tareas asincrónicas en JavaScript; son la alternativa más nueva a las devoluciones de llamada. Una promesa tiene muchas similitudes con una barra de progreso; representan un proceso inacabado y en curso. Un excelente ejemplo de esto es una solicitud a un servidor (por ejemplo, discord.js envía solicitudes a la API de Discord).

Una promesa puede tener tres estados; pendiente, resuelto y rechazado

El estado **pendiente** significa que la promesa aún está en curso y no se ha resuelto ni rechazado.
El estado **resuelto** significa que la promesa está hecha y ejecutada sin errores.
El estado **rechazado** significa que la promesa encontró un error y no se pudo ejecutar correctamente.

Una cosa importante que debe saber es que una promesa solo puede tener un estado simultáneamente; nunca puede estar pendiente y resuelto, rechazado y resuelto, o pendiente y rechazado. Es posible que se pregunte, "¿Cómo se vería eso en el código?". Aquí hay un pequeño ejemplo:

::: tip
Este ejemplo usa código ES6. Si no sabe qué es eso, debería leerlo [Aquí](/additional-info/es6-syntax.md).
:::

```js
function deleteMessages(amount) {
	return new Promise(resolve => {
		if (amount > 10) throw new Error('No puede eliminar más de 10 mensajes a la vez.');
		setTimeout(() => resolve('10 mensajes eliminados.'), 2000);
	});
}

deleteMessages(5).then(value => {
	// `deleteMessages` se ha completado y no ha ocurrido ningún error
	// El valor resuelto será la cadena de texto "10 mensajes eliminados"
}).catch(error => {
	// `deleteMessages` encontró un error
	// El error será un Objeto de error
});
```

En este escenario, la función `deleteMessages` retorna una promesa. El método `.then()` se activará si la promesa se resuelve, y el método `.catch()` si la promesa se rechaza. En la función `deleteMessages`, la promesa se resuelve después de 2 segundos con la cadena" 10 mensajes eliminados ", por lo que el método` .catch() `nunca se ejecutará. También puede pasar la función `.catch()` como segundo parámetro de `.then()`

## ¿Cómo implementar async/await?

### Teoría

Es fundamental conocer la siguiente información antes de trabajar con async/await.Solo puedes usar la palabra clave `await` dentro de una función declarada como` async` (pones la palabra clave `async` antes de la palabra clave `function` o antes de los parámetros cuando usas una función de devolución de llamada).

Un ejemplo sencillo sería:

```js
async function declaredAsAsync() {
	// ...
}
```

O bien

```js
const declaredAsAsync = async () => {
	// ...
};
```

También se puede usar al declarar una función flecha en un detector de eventos.

```js
client.on('evento', async (first, last) => {
	// ...
});
```

Una cosa importante a saber es que una función declarada como `async` siempre devolverá una promesa. Además de esto, si devuelve algo, la promesa se resolverá con ese valor, y si arroja un error, rechazará la promesa con ese error.

### Ejecución con código discord.js

Ahora que sabe cómo funcionan las promesas y para qué se utilizan, veamos un ejemplo que maneja varias promesas. Digamos que quiere reaccionar con letras (indicadores regionales) en un orden específico. Para este ejemplo, aquí hay una plantilla básica para un bot de discord.js con algunos ajustes de ES6.

```js
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('¡Estoy listo!');
});

client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'react') {
		// ...
	}
});

client.login('tu-token-va-aquí');
```

Si no sabe cómo funciona la ejecución asincrónica de Node.js, probablemente intente algo como esto:

```js {4-7}
client.on('interactionCreate', interaction => {
	// ...
	if (commandName === 'react') {
		const message = interaction.reply('¡Reaccionando!', { fetchReply: true });
		message.react('🇦');
		message.react('🇧');
		message.react('🇨');
	}
});
```

Pero dado que todos estos métodos se inician al mismo tiempo, sería una carrera a qué solicitud del servidor finalizó primero, por lo que no habría garantía de que reaccionaría en absoluto (si el mensaje no se recupera) o en el orden que querías. Para asegurarse de que reacciona después de que se envía el mensaje y en orden (a, b, c), necesitaría usar la devolución de llamada `.then()` de las promesa que estos métodos devuelven. El código se vería así:

```js {4-12}
client.on('interactionCreate', interaction => {
	// ...
	if (commandName === 'react') {
		interaction.reply('¡Reaccionando!', { fetchReply: true })
			.then(message => {
				message.react('🇦')
					.then(() => message.react('🇧'))
					.then(() => message.react('🇨'))
					.catch(error => {
						// manejar el error de cualquier rechazo de promesa aquí
					});
			});
	}
});
```

En este fragmento de código, las promesa se [resuelven en cadena](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise/then#encadenamiento) entre sí, y si una de las promesa es rechazada, se llama a la función `.catch()`. Aquí está el mismo código pero con async/await:

```js {1,4-7}
client.on('interactionCreate', async interaction => {
	// ...
	if (commandName === 'react') {
		const message = await interaction.reply('¡Reaccionando!', { fetchReply: true });
		await message.react('🇦');
		await message.react('🇧');
		await message.react('🇨');
	}
});
```

Es principalmente el mismo código, pero ¿cómo detectaría los rechazos de Promise ahora, ya que `.catch()` ya no está? Esa también es una característica útil con async/await; el error se lanzará si lo espera para que pueda envolver las promesas esperadas dentro de un try/catch, y estará listo para comenzar.

```js {1,4-11}
client.on('interactionCreate', async interaction => {
	if (commandName === 'react') {
		try {
			const message = await interaction.reply('¡Reaccionando!', { fetchReply: true });
			await message.react('🇦');
			await message.react('🇧');
			await message.react('🇨');
		} catch (error) {
			// manejar el error de cualquier rechazo de promesa aquí
		}
	}
});
```

Este código se ve limpio y también es fácil de leer.

Por lo tanto, es posible que se pregunte: "¿Cómo obtendría el valor con el que se resolvió la promesa?".

Veamos un ejemplo en el que desea eliminar una respuesta enviada.

```js {3-9}
client.on('interactionCreate', interaction => {
	// ...
	if (commandName === 'delete') {
		interaction.reply('Este mensaje será eliminado.', { fetchReply: true })
			.then(replyMessage => setTimeout(() => replyMessage.delete(), 10000))
			.catch(error => {
				// manejo del error
			});
	}
});
```

El valor de retorno de un `.reply()` con la opción `fetchReply` establecida en` true` es una Promise que se resuelve con la respuesta cuando se ha enviado, pero ¿cómo se vería el mismo código con async/await?

```js {1,4-10}
client.on('interactionCreate', async interaction => {
	if (commandName === 'delete') {
		try {
			const replyMessage = await interaction.reply('Este mensaje será eliminado.', { fetchReply: true });
			await replyMessage.delete({ timeout: 10000 });
		} catch (error) {
			// manejo del error
		}
	}
});
```

Con async/await, puede asignar la función esperada a una variable que represente el valor devuelto. Ahora ya sabe cómo usa async/await.
