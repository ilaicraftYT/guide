# Errores

No hay duda de que ha encontrado errores al crear bots. Si bien los errores son fundamentales para advertirle de lo que va mal, a muchas personas les desconciertan y cómo rastrearlos y solucionarlos, pero no se preocupe, lo tenemos cubierto. Esta sección tratará sobre el diagnóstico de errores, identificar de dónde provienen y corregirlos.

## Tipos de errores

### Errores de API
Los errores de API o DiscordAPIErrors son lanzados por la API de Discord cuando se lleva a cabo una solicitud no válida. Los errores de API se pueden diagnosticar principalmente mediante el mensaje que se proporciona. Puede examinar más a fondo los errores inspeccionando el método HTTP y la ruta utilizados. Exploraremos el seguimiento de estos errores en la siguiente sección.

Ejemplo: `DiscordAPIError: Cannot send an empty message` (No se puede enviar un mensaje vacio)

### Errores de discord.js

Los errores de discord.js son lanzados por la propia biblioteca. Por lo general, se pueden rastrear fácilmente mediante el [seguimiento de la pila](https://es.wikipedia.org/wiki/Stack_trace) y el mensaje de error.

Ejemplo: `The messages must be an Array, Collection, or number.` (Los mensajes deben ser un arreglo, una colección o un número.)

### Errores de JavaScript

Los errores de JavaScript son lanzados por el propio node o por discord.js. Estos errores se pueden solucionar fácilmente observando el tipo de error y el [seguimiento de la pila](https://es.wikipedia.org/wiki/Stack_trace). Puede encontrar una lista completa de tipos [aquí](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Error) Y una lista de errores comunes de js [aquí](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Errors).

Example: `ReferenceError: "x" is not defined` ("x" no esta definido)

### Errores de WebSocket y Red

Los errores de WebSocket y Red a son errores comunes del sistema que genera Node en respuesta a algún problema con la conexión de WebSocket.Desafortunadamente, estos errores no tienen una solución concreta y pueden (generalmente) solucionarse obteniendo una conexión mejor, más estable y más robusta. Discord.js intentará automáticamente volver a conectarse a WebSocket si se produce un error.

En la versión 12, los errores de WebSocket se manejan internamente, lo que significa que su proceso nunca debería fallar. Si desea registrar estos errores, en caso de que ocurran, puede escuchar el evento `shardError` como se muestra a continuación.

```js
client.on('shardError', error => {
	console.error('Una conexión de websocket encontró un error:', error);
});
```

Los códigos lanzados comúnmente para estos errores son:
- `ECONNRESET` - La conexión fue cerrada por la fuerza por un par, provocada por la pérdida de conexión a un WebSocket debido al tiempo de espera o al reinicio.
- `ETIMEDOUT` - Una solicitud de conexión o envío falló porque la parte receptora no respondió después de un tiempo.
- `EPIPE` - Se ha cerrado el lado remoto de la secuencia en la que se está escribiendo.
- `ENOTFOUND` - El dominio al que se accede no está disponible, generalmente debido a la falta de Internet, puede ser arrojado por WebSocket y la API HTTP.
- `ECONNREFUSED` - La máquina de destino rechazó la conexión; compruebe sus puertos y cortafuegos.

## Cómo diagnosticar errores de API

Los errores de API se pueden rastrear agregando un detector de eventos para los rechazos no controlados y mirando la información adicional.
Esto se puede hacer agregando esto a su archivo principal.

```js
process.on('unhandledRejection', error => {
	console.error('Rechazo de promesa no manejada:', error);
});
```

La próxima vez que reciba el error, se mostrará información en la parte inferior del error, que se verá así, por ejemplo:

```json
  name: 'DiscordAPIError',
  message: 'Invalid Form Body\nmessage_id: Value "[object Object]" is not snowflake.',
  path: '/api/v7/channels/638200642359525387/messages/[object%20Object]',
  code: 50035,
  method: 'GET'
```

Toda esta información puede ayudarlo a rastrear qué causó el error y cómo solucionarlo. En esta sección, repasaremos lo que significa cada propiedad.

### Mensaje

La parte más importante del error es el mensaje (message). Le dice qué salió mal, lo que puede ayudarlo a rastrear dónde se origina.
Puede encontrar una lista completa de mensajes [aquí](https://discord.com/developers/docs/topics/opcodes-and-status-codes#json) en los documentos de la API de Discord.

### Ruta

Otra información útil es la ruta (path), que le indica en qué punto final de API se produjo el error. Es posible que no podamos cubrir todos los puntos finales, pero suelen ser muy descriptivos.

En el ejemplo anterior, la ruta le dice que la acción se ejecutó en `/channels/`. El número que ve a continuación es el ID del canal. A continuación, puede detectar el alcance `message/`. El número es nuevamente la identificación del objeto. Combinado con el método `GET` se puede concluir que el bot intentó obtener el mensaje con el ID `[object Object]` del canal con el ID` 638200642359525387`.

Como el mensaje de error le dice que `[object Object]` no es un ID válido, entonces ya sabe dónde buscar un error. Descubra dónde pasa un objeto como ID cuando intenta buscar un mensaje y corrija su código en esa ubicación.

### Código

El código es otra representación parcial del mensaje, en este caso, `Invalid Form Body`.

The code is another partial representation of the message, in this case, `Invalid Form Body`. Puede encontrar una lista completa de códigos [aquí](https://discord.com/developers/docs/topics/opcodes-and-status-codes#json-json-error-codes)

El código también es útil si solo desea manejar un error específico. Supongamos que está intentando eliminar un mensaje que puede o no estar allí y desea ignorar los errores de mensajes desconocidos. Esto se puede hacer verificando el código, ya sea manualmente o usando las constantes de discord.js.

```js
message.delete().catch(error => {
	// Solo registra el error si no es un error de mensaje desconocido
	if (error.code !== 10008) {
		console.error('No se pudo borrar el mensaje:', error);
	}
});
```

O usando constantes:

```js
message.delete().catch(error => {
	if (error.code !== Discord.Constants.APIErrors.UNKNOWN_MESSAGE) {
		console.error('No se pudo borrar el mensaje:', error);
	}
});
```

Puede encontrar una lista de constantes [aquí](https://github.com/discordjs/discord.js/blob/stable/src/util/Constants.js#L552)

### Método

La información final puede decirle mucho sobre lo que intentó hacer con la ruta (path). Hay un conjunto de palabras clave predefinidas que describen nuestras acciones en el camino.

```
GET    - Se usa para recuperar un dato
POST   - Se usa para enviar un dato
PATCH  - Se usa para modificar un dato
PUT    - Se usa para reemplazar un dato por completo
DELETE - Se usa para eliminar un dato por completo
```

En este ejemplo en particular, puede ver que está intentando acceder a un dato, específicamente, un mensaje.

## Errores comunes de discord.js y API

### Se proporcionó un token no válido.

Este es un error frecuente; se origina a partir de un token incorrecto que se pasa a `client.login()`. Las causas más comunes de este error son:

- No se importa correctamente el archivo de configuración o env
- Copiar el secreto del cliente en lugar del token del bot (el token es alfanumérico y tres partes delimitadas por un punto, mientras que el secreto del cliente es significativamente más pequeño y solo una parte)
- Simplemente mostrando el token y copiándolo, en lugar de hacer clic en regenerar y copiarlo.

::: warning ADVERTENCIA
Antes del lanzamiento de la versión 12, solía haber un problema en el que el token no tenía el prefijo correcto, lo que provocaba que los tokens válidos se marcaran como no válidos. Si ha verificado que todo lo anterior no es el caso, asegúrese de haber actualizado discord.js a la versión estable actual.
:::

### Solicitud para usar el token, pero el token no estaba disponible para el cliente.

Otro error común: este error se origina cuando el cliente intenta ejecutar una acción que requiere el token, pero el token no está disponible. Esto suele deberse a la destrucción del cliente y luego al intentar realizar una acción.

Este error también se debe al intento de utilizar un cliente que no ha iniciado sesión. Los dos ejemplos siguientes arrojarán errores.

```js
const { Client, Intents } = require('discord.js');

// ¡No debería estar aquí!
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

module.exports = interaction => {
	const id = interaction.options.getString('id');
	// En su lugar, debería ser `interaction.client`!
	client.users.fetch(id).then(user => {
		interaction.reply(`Su usuario solicitado: ${user.tag}`);
	});
};
```

```js
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.on('interactionCreate', someHandlerFunction);

client.login('tu-token-va-aquí');
// ¡el cliente no ha iniciado sesión todavía!
client.users.fetch('myId').then(someInitFunction);
```

### Los nombres de los campos MessageEmbed no pueden estar vacíos.

Este error se origina al llamar a `MessageEmbed.addFields()` con la propiedad `name` de un objeto de campo como una cadena vacía. Si desea que el título esté vacío por alguna razón, debe usar un espacio de ancho cero, que se puede ingresar como `\u200b`.

### Los valores del campo MessageEmbed no pueden estar vacíos.

Junto con el error anterior, este error es el resultado de llamar a `MessageEmbed.addFields()` con la propiedad `value` de un objeto de campo como una cadena vacía. Puede utilizar un espacio de ancho cero si desea este espacio en blanco.

### Los mensajes deben ser un arreglo, una colección o un número.

Este error se origina en una llamada no válida a `bulkDelete()`. Asegúrese de ingresar un arreglo, colección de mensajes válida o un número válido.

### Los miembros no llegaron a tiempo.

Otro error común: este error se origina cuando el cliente solicita miembros de la API a través de WebSocket y los fragmentos de miembros no llegan a tiempo y activan el tiempo de espera. La causa más común de este error es una mala conexión; sin embargo, también puede deberse a la obtención de muchos miembros, más de 50 mil. Para solucionar este problema, ejecute el bot en una ubicación con mejor Internet, como un VPS. Si esto no funciona para usted, tendrá que cambiar manualmente el tiempo de espera de recuperación de miembros codificados en el código fuente.

### MaxListenersExceededWarning: Posible fuga de memoria EventEmitter detectada ...

Este error se debe a la generación de una gran cantidad de detectores de eventos, generalmente para el cliente. La causa más común de esto es anidar sus detectores de eventos en lugar de separarlos. La forma de corregir este error es asegurarse de no anidar sus detectores de eventos; **no** usar `emitter.setMaxListeners ()` como sugiere el error.

Puede depurar estos mensajes de diferentes formas:
- A través de la [CLI](https://nodejs.org/api/cli.html#cli_trace_warnings): `node --trace-warnings index.js`
- A través del [evento `process#warning`](https://nodejs.org/api/process.html#process_event_warning): `process.on('warning', console.warn);`

### No se pueden enviar mensajes a este usuario.

Este error se produce cuando el bot intenta enviar un mensaje directo a un usuario, pero no puede hacerlo. Varias razones causan esto:
- El bot y el usuario no comparten un gremio (a menudo, la gente intenta enviar un MD al usuario después de expulsarlos o banearlos).
- El bot intenta enviar un mensaje directo a otro bot.
- El usuario ha bloqueado el bot.
- El usuario ha desactivado los mensaje directos en la configuración de privacidad.

En el caso de las dos últimas razones, el error no se puede evitar, ya que la API de Discord no proporciona una forma de verificar si puede enviar un dm a un usuario hasta que intente enviar uno. La mejor manera de manejar este error es agregar un `.catch()` donde intenta enviar un md al usuario e ignora la promesa rechazada o hace lo que quiera debido a ella.

## Errores varios comunes

### código ENOENT ... syscall spawn git.

Este error es comúnmente lanzado por su sistema debido a que no encuentra `git`. Necesita instalar `git` o actualizar su ruta si `git` ya está instalado. Aquí están los enlaces de descarga para ello:
- Ubuntu/Debian: `sudo apt-get install git`
- Windows: [git-scm](https://git-scm.com/download/win)

### código ELIFECYCLE

Este error es comúnmente lanzado por su sistema en respuesta al cierre inesperado del proceso. Limpiar la caché npm y eliminar node_modules generalmente puede solucionarlo. Las instrucciones para hacerlo son las siguientes:
- Limpiar el caché de npm con `npm cache clean --force`
- Borrar `node_modules`
- Borrar `package-lock.json` (¡asegúrese de tener un `package.json`!)
- Ejecutar `npm install` para reinstalar los paquetes desde `package.json`
