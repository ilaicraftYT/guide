# Usando una REST API

Las API REST son extremadamente populares en la web y le permiten obtener libremente los datos de un sitio si tiene una API disponible a través de una conexión HTTP.

Si alguna vez ha visto un bot de música que acepta una consulta de YouTube en lugar de solo la URL de un video, entonces ha visto una API REST en acción. discord.js usa la API de Discord, por lo que probablemente hayas usado una API tú mismo.

# Realizando solicitudes HTTP con Node

En estos ejemplos, usaremos [node-fetch](https://www.npmjs.com/package/node-fetch), una excelente librería para realizar solicitudes HTTP.

Para instalar node-fetch, ejecute el siguiente comando:

```bash
npm install node-fetch
```

## Esqueleto del código

Para comenzar, solo usará este código base:

<!-- eslint-disable require-await -->
```js
const { Client, Intents, MessageEmbed } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	// ...
});

client.login('tu-token-va-aquí');
```

::: tip
Vamos a aprovechar [desestructuración](/informacion-adicional/sintaxis-ES6.md#desestructuración) en este tutorial para mantener la legibilidad.
:::

## Usando node-fetch

node-fetch es un módulo ligero basado en `Promise` que trae la [Fetch API](https://developer.mozilla.org/es/docs/Web/API/Fetch_API), que está disponible desde los navegadores a Node.js. Si aún no está familiarizado con las promesas, debería leerlas [aquí](/informacion-adicional/async-await.md).

En este tutorial, crearemos un bot con dos comandos basados en API usando las APIs [random.cat](https://aws.random.cat) y [Urban Dictionary](https://www.urbandictionary.com).

Para requerir `node-fetch`, haría lo siguiente:

```js
const fetch = require('node-fetch');
```

### Random Cat

La API de Random Cat está disponible en https://aws.random.cat/meow y devuelve una respuesta [JSON](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON). Para obtener datos de la API, debe hacer lo siguiente:

```js
fetch('https://aws.random.cat/meow').then(response => response.json());
```

Puede parecer que esto no hace nada, pero lo que está haciendo es lanzar una solicitud al servidor random.cat. El servidor está devolviendo algo de JSON que contiene una propiedad de `file`, que es una cadena que contiene un enlace a un gato aleatorio. `node-fetch` devuelve un objeto de respuesta, que podemos cambiar a JSON con `response.json()`. A continuación, implementemos esto en un comando. El código debería verse similar a esto:

```js {3-6}
client.on('interactionCreate', async interaction => {
	// ...
	if (commandName === 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());
		interaction.reply({ files: [file] });
	}
});
```

Entonces, esto es lo que está sucediendo en este código:

1. Estás enviando una solicitud `GET` a random.cat.
2. random.cat ve su solicitud y obtiene un archivo aleatorio de su base de datos.
3. random.cat luego envía la URL de ese archivo como un objeto JSON que contiene un enlace a la imagen.
4. node-fetch recibe la respuesta y la deserializa con `response.json()`.
5. Luego envía la propiedad `file` del objeto en Discord.

::: warning ADVERTENCIA
La respuesta solo se analizará si el encabezado `Content-Type` del servidor incluye `application/json`. En algunos casos, puede que tenga que aplicar el método `.text()` en lugar de `.json()` y [JSON.parse()](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) usted mismo.
:::

### Urban Dictionary

La API de Urban Dictionary's esta disponible en https://api.urbandictionary.com/v0/define, accepta el parametro `term`, y retorna una respuesta JSON.

Primero, necesitará obtener datos de la API. Para hacer esto, harías:

```js {1,5-11}
const querystring = require('querystring');
// ...
client.on('interactionCreate', async interaction => {
	// ...
	if (commandName === 'urban') {
		const term = interaction.options.getString('term');
		const query = querystring.stringify({ term });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`)
			.then(response => response.json());
	}
});
```

Aquí, usamos el módulo nativo de Node [querystring](https://nodejs.org/api/querystring.html) para crear una  [cadena de consulta](https://es.wikipedia.org/wiki/Query_string) y la pasamos a la URL para que el servidor Urban Dictionary pueda analizarla y saber qué buscar.

Si tuviera que hacer `/urban hello world`, entonces la URL se convertiría en https://api.urbandictionary.com/v0/define?term=hello%20world ya que la cadena se codifica.

Puede obtener las propiedades respectivas del JSON devuelto. Si tuviera que verlo en su navegador, por lo general parece un montón de palabrería. Si no es así, ¡genial! Si es así, debería obtener un formateador/visor JSON. Si usa Chrome, [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa) es una de las extensiones más populares. Si no utiliza Chrome, busque "Formateador/visor JSON&lt; su navegador&gt;" y consigue uno.

::: tip
El navegador [Mozilla Firefox](https://www.mozilla.org/es-ES/firefox/new/) le da formato a los JSON por defecto.
:::

Now, if you look at the JSON, you can see that it's a `list` property, which is an array of objects containing various definitions for the term (maximum 10). Something you always want to do when making API-based commands is to handle no results. So, let's throw a random term in there (e.g. `njaksdcas`) and then look at the response. The `list` array should then be empty. Now you are ready to start writing!

As explained above, you'll want to check if the API returned any answers for your query, and send back the definition if so:

```js {3-5,7}
if (commandName === 'urban') {
	// ...
	if (!list.length) {
		return interaction.reply(`No encontré resultados para **${term}**.`);
	}

	interaction.reply(`**${term}**: ${list[0].definition}`);
}
```

Aquí, solo obtiene el primer objeto de la matriz (array) de objetos llamada `list` y obtiene su propiedad `definition`.

Si ha seguido el tutorial, debería tener algo como esto:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>urban</DiscordInteraction>
		</template>
		<DiscordMention :highlight="true" profile="user" />, No encontré resultados para <strong>njaksdcas</strong>
	</DiscordMessage>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>urban</DiscordInteraction>
		</template>
		<strong>Hello World</strong>: El primer y más fácil programa que cualquier novato escribiría. Aplica para cualquier idioma. También lo que vería en el primer capítulo de la mayoría de los libros de programación.
	</DiscordMessage>
</DiscordMessages>

Ahora, hagamos de esto un [embed](/temas-populares/incrustaciones.md).

También vamos a definir una función de utilidad en la parte superior del archivo para que la inserción no produzca errores cuando el valor del campo supere los 1024 caracteres. Aquí hay un poco de código para hacer eso:

```js
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
```

El siguiente fragmento muestra cómo estructurar la inserción:
```js
const [answer] = list;

const embed = new MessageEmbed()
	.setColor('#EFFF00')
	.setTitle(answer.word)
	.setURL(answer.permalink)
	.addFields(
		{ name: 'Definición', value: trim(answer.definition, 1024) },
		{ name: 'Ejemplo', value: trim(answer.example, 1024) },
		{ name: 'Votos', value: `${answer.thumbs_up} pulgares arriba. ${answer.thumbs_down} pulgares abajo.` },
	);

interaction.reply({ embeds: [embed] });
```

Ahora, si vuelve a hacer el mismo comando, debería obtener esto:

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				:command="true"
			>urban</DiscordInteraction>
		</template>
		<template #embeds>
			<DiscordEmbed border-color="#EFFF00" embed-title="Hola mundo" url="https://www.urbandictionary.com/define.php?term=hello%20world">
				<template #fields>
					<DiscordEmbedFields>
						<DiscordEmbedField field-title="Definición">
							El primer y más fácil programa que cualquier novato escribiría. Aplica para cualquier idioma. También lo que vería en el primer capítulo de la mayoría de los libros de programación.
						</DiscordEmbedField>
						<DiscordEmbedField field-title="Ejemplo">
							Programador novato: ¡Oye, acabo de asistir a mi primera lección de programación antes! <br>
							Veterano en .NET: ¿Oh? ¿Qué puedes hacer? <br>
							Programador novato: Podría hacer que aparezca un cuadro de diálogo que diga "¡Hola mundo!" !!! <br>
							Veterano en .NET: Jaja... ¡hey chicos! miren, un programador de "hola mundo" <br><br>
							Console.WriteLine("Hola mundo")
						</DiscordEmbedField>
						<DiscordEmbedField field-title="Votos">
							122 pulgares arriba. <br>
							42 pulgares abajo.
						</DiscordEmbedField>
					</DiscordEmbedFields>
				</template>
			</DiscordEmbed>
		</template>
	</DiscordMessage>
</DiscordMessages>

## Resulting code

<ResultingCode />
