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
Si no entiende cómo funciona `.some()`, puede leerlo con más detalle [aquí](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/some).
:::

En este filtro, recorre en iteración las respuestas para encontrar lo que desea. Le gustaría ignorar el caso porque pueden ocurrir errores tipográficos simples, por lo que convierte cada respuesta a su forma en minúsculas y verifica si es igual a la respuesta en minúsculas también. En la sección de opciones, solo desea permitir que pase una respuesta, de ahí la configuración `max: 1`.

El filtro busca mensajes que coincidan con una de las respuestas en el arreglo (array) de posibles respuestas para pasar por el recolector. Las opciones (el segundo parámetro) especifican que solo un máximo de un mensaje puede pasar por el filtro correctamente antes de que la Promesa se resuelva correctamente. La sección de errores especifica que el tiempo hará que se produzca un error, lo que hará que la promesa se rechace si no se recibe una respuesta correcta dentro del límite de tiempo de un minuto. Como puede ver, no hay un evento de `recolectado`, por lo que está limitado en ese sentido.

## Recolectores de reacciones

### Recolector de reacciones básico

Estos funcionan de manera bastante similar a los recolectores de mensajes, excepto que los aplica en un mensaje en lugar de un canal. Este ejemplo utiliza el método <DocsLink path="class/Message?scrollTo=createReactionCollector" type="method" />. El filtro buscará el emoji `👍` , específicamente en el tono de piel predeterminado, así que ten cuidado con eso. También verificará que la persona que reaccionó comparte la misma identificación que el autor del mensaje original al que se asignó el recolector.

```js
const filter = (reaction, user) => {
	return reaction.emoji.name === '👍' && user.id === message.author.id;
};

const collector = message.createReactionCollector({ filter, time: 15000 });

collector.on('collect', (reaction, user) => {
	console.log(`${reaction.emoji.name} recolectado de ${user.tag}`);
});

collector.on('end', collected => {
	console.log(`${collected.size} items recolectados`);
});
```

### Esperando reacciones

<p><DocsLink path="class/Message?scrollTo=awaitReactions" type="method" /> funciona casi igual que un recolector de reacciones, excepto que está basado en promesa. Se aplican las mismas diferencias que con los recolectores de canales.</p>

```js
const filter = (reaction, user) => {
	return reaction.emoji.name === '👍' && user.id === message.author.id;
};

message.awaitReactions({ filter, max: 4, time: 60000, errors: ['time'] })
	.then(collected => console.log(collected.size))
	.catch(collected => {
		console.log(`Después de un minuto, solo ${collect.size} de 4 reaccionó.`);
	});
```

## Recolectores de interacciones

El tercer tipo de recolector le permite recolectar interacciones; como cuando los usuarios activan un comando de barra o hacen clic en un botón en un mensaje.

### Recolector de componentes básicos

La recolección de interacciones de los componentes del mensaje funciona de manera similar a los recolectores de reacciones. En el siguiente ejemplo, comprobará que la interacción procede de un botón y que el usuario que hace clic en el botón es el mismo que inició el comando.

Una diferencia importante a tener en cuenta con los recolectores de interacciones es que Discord espera una respuesta a *todas* las interacciones en 3 segundos, incluso las que no desea recolectar. Por esta razón, es posible que desee usar `.deferUpdate()` en todas las interacciones en su filtro, o no usar un filtro en absoluto y manejar este comportamiento en el evento `collect`.

```js
const collector = message.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

collector.on('collect', i => {
	if (i.user.id === interaction.user.id) {
		i.reply(`${i.user.id} hizo clic en el botón ${i.customId}.`);
	} else {
		i.reply({ content: `¡Estos botones no son para ti!`, ephemeral: true });
	}
});

collector.on('end', collected => {
	console.log(`${collected.size} interacciones recolectadas`);
});
```

### Esperando componentes

Como antes, esto funciona de manera similar al recolector de componentes, excepto que está basado en promesas.

A diferencia de otros recolectores basados en promesa, este método solo recolectará una interacción que pase el filtro. Si no se recolectan interacciones antes de que acabe el tiempo, la promesa se rechazará. Este comportamiento se alinea con el requisito de Discord de que las acciones deben recibir una respuesta inmediata. En este ejemplo, usará `.deferUpdate()` en todas las interacciones en el filtro.

```js
const filter = i => {
	i.deferUpdate();
	return i.user.id === interaction.user.id;
};

message.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 })
	.then(interaction => interaction.editReply(`haz selecionado ${interaction.values.join(', ')}!`))
	.catch(err => console.log(`No se recogieron interacciones.`));
```
