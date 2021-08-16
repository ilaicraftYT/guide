# Colecciones

## Recolectores de mensajes
<br/>
<DocsLink path="class/Collector"><code>Colectores</code></DocsLink> son útiles para permitir que su bot obtenga entrada *adicional* después de que se envió el primer comando.  Un ejemplo sería iniciar una prueba, donde el bot "esperará" una respuesta correcta de alguien.

### Recolector de mensajes basico

Por ahora, tomemos el ejemplo que nos han proporcionado:

```js
// `m` es un objeto de mensaje que se pasará a través de la función de filtro
const filter = m => m.content.includes('discord');
const collector = interaction.channel.createMessageCollector({ filter, time: 15000 });

collector.on('collect', m => {
	console.log(`Mensaje recolectado: ${m.content}`);
});

collector.on('end', collected => {
	console.log(`${collected.size} items recolectados`);
});
```
:::danger ADVERTENCIA
Para este ejemplo, se necesita el [intent](/intents) `GUILD_MESSAGES`
:::


Puede proporcionar una clave de `filtro` para el parámetro de objeto de `createMessageCollector()`. El valor de esta clave debe ser una función que devuelva un valor booleano para indicar si este mensaje debe recolectase o no. Para verificar múltiples condiciones en su filtro, puede conectarlas usando [operadores logicos](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Expressions_and_Operators#operadores_l%C3%B3gicos).  Si no proporciona un filtro, se recolectarán todos los mensajes del canal en el que se inició el recolector.

Tenga en cuenta que el ejemplo anterior usa [retorno implícito](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Functions/Arrow_functions#cuerpo_de_funci%C3%B3n) para la función de filtro y los pases al objeto de opciones usando la notación [abreviada de propiedad del objeto](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#property_definitions).

Si un mensaje pasa por el filtro, activará el evento `collect` para el `recolector` que ha creado. Este mensaje luego se pasa al detector de eventos como `colectado` y se ejecuta la función proporcionada. En el ejemplo anterior, simplemente registra el mensaje. Una vez que el recolector termina de recolectar en función de las condiciones finales proporcionadas, se emite el evento `end`.

Puede controlar cuándo termina un recolector proporcionando claves de opción adicionales al crear un recolector:

* `time`:Cantidad de tiempo en milisegundos que el colector debería funcionar
* `max`:  Número de mensajes para pasar el filtro con éxito
* `maxProcessed`: Número de mensajes encontrados (sin importar el resultado del filtro)

El beneficio de usar un recolector basado en eventos sobre `awaitMessages()`

The benefit of using an event-based collector over `.awaitMessages()` (su contraparte basada en promesas) es que puede hacer algo directamente después de que se recolecte cada mensaje, en lugar de hacerlo justo después de que finalice el recolector. También puede detener el recolector manualmente llamando `collector.stop()`.

### Esperando mensajes

Usando <DocsLink path="class/TextChannel?scrollTo=awaitMessages" type="method" /> puede ser más fácil si comprende promesas y le permite tener un código más limpio en general. Es esencialmente idéntico a <DocsLink path="class/TextChannel?scrollTo=createMessageCollector" type="method" />, excepto las promesas. Sin embargo, el inconveniente de utilizar este método es que no puede hacer nada antes de que se resuelva o rechace la promesa, ya sea por error o por finalización. Aun así debería funcionar para la mayoría de los propósitos, como esperar la respuesta correcta en un cuestionario. En lugar de tomar su ejemplo, configuremos un comando de prueba básico usando la función `.awaitMessages()`.

Primero, necesitará algunas preguntas y respuestas para elegir, así que aquí tiene un conjunto básico:

```json
[
	{
		"pregunta": "¿De que color es el cielo?",
		"respuestas": ["azul"]
	},
	{
		"pregunta": "¿Cuántas letras hay en el alfabeto?",
		"respuestas": ["26", "veintiséis"]
	}
]
```

El conjunto proporcionado permite el error del usuario  con una variedad de respuestas permitidas. Idealmente, sería mejor colocar esto en un archivo JSON, al que puede llamar `quiz.json` para simplificar.

```js
const quiz = require('./quiz.json');
// ...
const item = quiz[Math.floor(Math.random() * quiz.length)];
const filter = response => {
	return item.respuestas.some(answer => respuestas.toLowerCase() === response.content.toLowerCase());
};

interaction.reply(item.pregunta, { fetchReply: true })
	.then(() => {
		interaction.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
			.then(collected => {
				interaction.followUp(`${collected.first().author} ¡Me dio la respuesta correcta!`);
			})
			.catch(collected => {
				interaction.followUp('Parece que nadie obtuvo la respuesta esta vez.');
			});
	});
```

::: tip
If you don't understand how `.some()` works, you can read about it in more detail [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
:::

In this filter, you iterate through the answers to find what you want. You would like to ignore the case because simple typos can happen, so you convert each answer to its lowercase form and check if it's equal to the response in lowercase form as well. In the options section, you only want to allow one answer to pass through, hence the `max: 1` setting.

The filter looks for messages that match one of the answers in the array of possible answers to pass through the collector. The options (the second parameter) specifies that only a maximum of one message can go through the filter successfully before the Promise successfully resolves. The errors section specifies that time will cause it to error out, which will cause the Promise to reject if one correct answer is not received within the time limit of one minute. As you can see, there is no `collect` event, so you are limited in that regard.

## Reaction collectors

### Basic reaction collector

These work quite similarly to message collectors, except that you apply them on a message rather than a channel. This example uses the <DocsLink path="class/Message?scrollTo=createReactionCollector" type="method" /> method. The filter will check for the 👍 emoji–in the default skin tone specifically, so be wary of that. It will also check that the person who reacted shares the same id as the author of the original message that the collector was assigned to.

```js
const filter = (reaction, user) => {
	return reaction.emoji.name === '👍' && user.id === message.author.id;
};

const collector = message.createReactionCollector({ filter, time: 15000 });

collector.on('collect', (reaction, user) => {
	console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} items`);
});
```

### Await reactions

<p><DocsLink path="class/Message?scrollTo=awaitReactions" type="method" /> works almost the same as a reaction collector, except it is Promise-based. The same differences apply as with channel collectors.</p>

```js
const filter = (reaction, user) => {
	return reaction.emoji.name === '👍' && user.id === message.author.id;
};

message.awaitReactions({ filter, max: 4, time: 60000, errors: ['time'] })
	.then(collected => console.log(collected.size))
	.catch(collected => {
		console.log(`After a minute, only ${collected.size} out of 4 reacted.`);
	});
```

## Interaction collectors

The third type of collector allows you to collect interactions; such as when users activate a slash command or click on a button in a message.

### Basic message component collector

Collecting interactions from message components works similarly to reaction collectors. In the following example,  you will check that the interaction came from a button, and that the user clicking the button is the same user that initiated the command.

One important difference to note with interaction collectors is that Discord expects a response to *all* interactions within 3 seconds - even ones that you don't want to collect. For this reason, you may wish to `.deferUpdate()` all interactions in your filter, or not use a filter at all and handle this behavior in the `collect` event.

```js
const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

collector.on('collect', i => {
	if (i.user.id === interaction.user.id) {
		i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
	} else {
		i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
	}
});

collector.on('end', collected => {
	console.log(`Collected ${collected.size} interactions.`);
});
```

### Await message component

As before, this works similarly to the message component collector, except it is Promise-based.

Unlike other Promise-based collectors, this method will only ever collect one interaction that passes the filter. If no interactions are collected before the time runs out, the Promise will reject. This behavior aligns with Discord's requirement that actions should immediately receive a response. In this example, you will use `.deferUpdate()` on all interactions in the filter.

```js
const filter = i => {
	i.deferUpdate();
	return i.user.id === interaction.user.id;
};

message.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 })
	.then(interaction => interaction.editReply(`You selected ${interaction.values.join(', ')}!`))
	.catch(err => console.log(`No interactions were collected.`));
```
