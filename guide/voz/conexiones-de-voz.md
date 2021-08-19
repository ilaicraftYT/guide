# Conexiones de voz

Las conexiones de voz representan conexiones a canales de voz en un servidor. Solo puedes conectarte a un canal de voz en un servidor a la vez.

Las conexiones de voz harán automáticamente todo lo posible para restablecer sus conexiones cuando se muevan a través de los canales de voz o si cambia la región del servidor de voz.

## Hoja de trucos

### Creation

Crear una conexión de voz es simple:

```js
const { joinVoiceChannel } = require('@discordjs/voice');

const connection = joinVoiceChannel({
	channelId: channel.id,
	guildId: channel.guild.id,
	adapterCreator: channel.guild.voiceAdapterCreator,
});
```

Si intentas llamar a `joinVoiceChannel` en otro canal del mismo servidor en el que ya hay una conexión de voz activa, la conexión de voz existente cambia al nuevo canal.

### Acceso

Puede acceder a las conexiones creadas en otras partes de su código sin tener que realizar un seguimiento de las conexiones usted mismo. Es una buena práctica no rastrear las conexiones de voz usted mismo, ya que puede olvidarse de limpiarlas una vez que se destruyen, lo que provoca pérdidas de memoria.

```js
const { getVoiceConnection } = require('@discordjs/voice');

const connection = getVoiceConnection(myVoiceChannel.guild.id);
```

### Supresión

Puede destruir una conexión de voz cuando ya no la necesite. Esto desconectará su conexión si todavía está activa, detendrá la reproducción de audio y lo eliminará del rastreador interno para las conexiones de voz.

Es importante que destruya las conexiones de voz cuando ya no sean necesarias para que su bot abandone el canal de voz y para evitar pérdidas de memoria.

```js
connection.destroy();
```

### Reproducción de audio

Puede suscribir conexiones de voz a reproductores de audio tan pronto como se creen. Los reproductores de audio intentarán transmitir audio a todas sus conexiones de voz suscritas que estén en estado `Ready`. Las conexiones de voz destruidas no se pueden suscribir a reproductores de audio.

```js
// Suscribe la conexión al reproductor de audio (reproducirá audio en la conexión de voz)
const subscription = connection.subscribe(audioPlayer);

// La suscripción podría no estar definida si se destruye la conexión.
if (subscription) {
	// Cancelar la suscripción después de 5 segundos (dejar de reproducir audio en la conexión de voz)
	setTimeout(() => subscription.unsubscribe(), 5_000);
}
```

::: warning ADVERTENCIA
**Las conexiones de voz se pueden suscribir a un reproductor de audio como máximo.** Si intenta suscribirse a otro reproductor de audio mientras ya está suscrito a uno, el reproductor de audio actual se cancela y se reemplaza por el nuevo.
:::

## Ciclos de vida

Las conexiones de voz tienen su propio ciclo de vida, con cinco estados distintos. Puede seguir los métodos discutidos en la sección [ciclos de vida](./ciclos-de-vida.md) para suscribirse a los cambios en las conexiones de voz.

- **Signalling** - el estado inicial de una conexión de voz. La conexión estará en este estado cuando solicite permiso para unirse a un canal de voz.

- **Connecting** - el estado en el que entra una conexión de voz una vez que tiene permiso para unirse a un canal de voz y está en proceso de establecer una conexión con él.

- **Ready** - el estado en el que entra una conexión de voz una vez que se ha establecido con éxito una conexión con el canal de voz. Está listo para reproducir audio en este estado.

- **Disconnected** - el estado en el que entra una conexión de voz cuando se corta la conexión con un canal de voz. Esto puede ocurrir incluso si aún no se ha establecido la conexión. Puede optar por intentar volver a conectarse en este estado.

- **Destroyed** - el estado en el que entra una conexión de voz cuando se ha destruido manualmente. Esto evitará que se reutilice accidentalmente y se eliminará de un rastreador en memoria de conexiones de voz.

```js
const { VoiceConnectionStatus } = require('@discordjs/voice');

connection.on(VoiceConnectionStatus.Ready, () => {
	console.log('La conexión ha entrado en el estado Ready, ¡lista para reproducir audio!');
});
```

## Manejo de desconexiones

Las desconexiones pueden ser bastante complejas de manejar. Hay 3 casos para manejar desconexiones:

1. **Desconexiones reanudables** - no hay una razón clara por la que ocurrió la desconexión. En este caso, las conexiones de voz intentarán reanudar automáticamente la sesión existente. La conexión de voz entrará en el estado `Connecting`. Si esto falla, puede volver a entrar en un estado `Disconnected`.

2. **Desconectadores reconectables** - Discord ha cerrado la conexión y ha dado una razón de por qué, y que la razón es recuperable. En este caso, la conexión de voz intentará automáticamente volver a unirse al canal de voz. La conexión de voz entrará en el estado de  `Signalling`. Si esto falla, puede volver a entrar en un estado `Disconnected`.

3. **Desconexiones potencialmente reconectables** - el bot se ha movido a otro canal de voz, el canal se ha eliminado o el bot ha sido expulsado / perdido el acceso al canal de voz. El bot entrará en el estado `Disconnected`.

Como se muestra arriba, los dos primeros casos son cubiertos automáticamente por la propia conexión de voz. El único caso en el que debe pensar detenidamente es el tercer caso.

El tercer caso puede ser bastante problemático de tratar como una desconexión, ya que el bot podría simplemente estar moviéndose a otro canal de voz y, por lo tanto, no estar "verdaderamente" desconectado.

Una solución imperfecta a esto es ver si el bot ha entrado en un estado de `Signalling` / `Connecting` poco después de entrar en el estado `Disconnected`. Si es así, significa que el bot ha movido los canales de voz. De lo contrario, deberíamos tratarlo como una desconexión real y no reconectarnos.

```js
const { VoiceConnectionStatus, entersState } = require('@discordjs/voice');

connection.on(VoiceConnectionStatus.Disconnected, async (oldState, newState) => {
	try {
		await Promise.race([
			entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
			entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
		]);
		// Parece que se está volviendo a conectar a un nuevo canal; ignore la desconexión
	} catch (error) {
		// Parece ser una desconexión real de la que NO DEBE recuperarse
		connection.destroy();
	}
});
```
