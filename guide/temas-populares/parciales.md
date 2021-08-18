# Estructuras parciales

Las Estructuras Parciales se introdujeron en la libreria en la versión `12`  y se reciben opcionalmente siempre que los datos sean insuficientes  para emitir un evento del cliente con una estructura de `discord.js` completamente intacta. Están (como sugiere el nombre) incompletos y no puede esperar que tengan más información además de su `ID`. Todas las demás propiedades y métodos de este objeto deben considerarse inválidos y desaparecidos. Antes de esta característica, los eventos de cliente de `discord.js` no se emitirían si una de las estructuras necesarias no se pudiera construir con datos suficientes para garantizar una estructura completamente funcional. Si no opta por los parciales, este sigue siendo el caso.

Un ejemplo de aprovechamiento de parciales es el manejo de reacciones en mensajes no almacenados en caché, que se explica en [esta página](./reacciones.html#escuchar-las-reacciones-de-los-mensajes-antiguos).

Antes, tenía que manejar el evento `raw` indocumentado o recuperar los mensajes respectivos al inicio. El primer enfoque era propenso a errores y a un comportamiento interno inesperado. El segundo tampoco fue completamente a prueba de fallas, ya que los mensajes aún podrían eliminarse en caché si se excedía el tamaño de la caché en los canales ocupados.

## Activación de los parciales

Como dijimos anteriormente, los parciales no tienen toda la información necesaria para que sean estructuras discord.js completamente funcionales, por lo que no sería una buena idea habilitar la funcionalidad por defecto. Los usuarios deben saber cómo manejarlos antes de optar por esta función.

Usted elige qué estructuras quiere emitir como parciales en las opciones del cliente al instanciar el cliente de su bot. Las estructuras disponibles son: `USER`, `CHANNEL` (sólo los canales de MD pueden no ser almacenados, los canales del servidor siempre estarán disponibles), `GUILD_MEMBER`, `MESSAGE`, y `REACTION`.

```js
const { Client } = require('discord.js');

const client = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
```

::: warning ADVERTENCIA
Asegúrate de habilitar todos los parciales que necesites para tu caso de uso. Si te falta uno, el evento no se emitirá.
:::

::: warning ADVERTENCIA
Las estructuras parciales están habilitadas globalmente. No puedes hacer que funcionen sólo para un evento o caché específico, y es muy probable que tengas que adaptar otras partes de tu código que estén accediendo a los datos de las cachés relevantes. ¡Todas las cachés que contengan el tipo de estructura respectivo podrían devolver parciales también!
:::

## Manejo de datos parciales

Todas las estructuras para las que se puede elegir el uso de parciales tienen una nueva propiedad, llamada apropiadamente `.partial`, que indica si es una instancia totalmente funcional o parcial de su clase. El valor es `true` si es parcial, `false` si es totalmente funcional.

::: warning ADVERTENCIA
Los datos parciales sólo pueden contener un ID. No asuma que ninguna propiedad o método funciona cuando se trata de una estructura parcial.
:::

```js
if (message.partial) {
	console.log('El mensaje es parcial.');
} else {
	console.log('El mensaje no es parcial.');
}
```

## Obtención de la estructura completa

Junto con `.partial` para comprobar si la estructura a la que se llama es parcial o no, la libreria también ha introducido un método `.fetch()` para recuperar los datos que faltan de la API y completar la estructura. El método devuelve una [Promesa](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Promise) que necesitas resolver. Después de que se resuelva la Promesa (y con ella, los datos que faltaban), puedes utilizar la estructura como lo harías antes.
```js {2-8,10}
if (message.partial) {
	message.fetch()
		.then(fullMessage => {
			console.log(fullMessage.content);
		})
		.catch(error => {
			console.log('Algo ha ido mal al buscar el mensaje: ', error);
		});
} else {
	console.log(message.content);
}
```

::: warning ADVERTENCIA
No se pueden obtener datos borrados desde la API. Para las eliminaciones de mensajes, `messageDelete` sólo emitirá la Id, que no puede utilizar para obtener el mensaje completo con el contenido, el autor u otra información, ya que es inaccesible en el momento en que recibe el evento.
:::
