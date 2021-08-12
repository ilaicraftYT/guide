# Ciclos de Vida

Dos de los componentes principales con los que interactuará cuando use `@discordjs/voice` son:

- **VoiceConnection** – mantiene una conexión de red a un servidor de voz Discord
- **AudioPlayer** – reproduce recursos de audio a través de una conexión de voz

Tanto las conexiones de voz como los reproductores de audio tienen _estado_, y puede suscribirse a los cambios en su estado a medida que avanzan en sus respectivos ciclos de vida.

Es importante escuchar los eventos de cambio de estado, ya que probablemente requerirán que tome alguna acción. Por ejemplo, una conexión de voz que ingresa al estado `Disconnected` probablemente requerirá que intente volver a conectarla.

Sus ciclos de vida individuales con descripciones de sus estados están documentados en sus respectivas páginas.

Escuchar los cambios en los ciclos de vida de las conexiones de voz y los reproductores de audio se puede realizar de dos formas:

## Seguimiento a eventos individuales

```js
const { VoiceConnectionStatus, AudioPlayerStatus } = require('@discordjs/voice');

connection.on(VoiceConnectionStatus.Ready, (oldState, newState) => {
	console.log('¡La conexión está en estado Ready!');
});

player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
	console.log('¡El reproductor de audio está en estado Playing!');
});
```

:::tip
Una ventaja de escuchar las transiciones a estados individuales es que resulta mucho más fácil escribir lógica secuencial. Esto se simplifica con nuestro [asistente de transición de estado](https://github.com/discordjs/voice/blob/main/src/util/entersState.ts). A continuación se muestra un ejemplo.

```js
const { AudioPlayerStatus, entersState } = require('@discordjs/voice');

async function start() {
	player.play(resource);
	try {
		await entersState(player, AudioPlayerStatus.Playing, 5_000);
		// El reproductor ha entrado en el estado de Playing en 5 segundos.
		console.log('¡La reproducción ha comenzado!');
	} catch (error) {
		// El reproductor no ha entrado en el estado de Playing o también:
		// 1) El evento 'error' se ha emitido y debe manejarse
		// 2) Han pasado 5 segundos
		console.error(error);
	}
}

void start();
```
:::

## Seguimiento a todas las transiciones de estado

Si prefiere mantener un solo detector de eventos para todas las posibles transiciones de estado, también puede escuchar el evento `stateChange`:

```js
connection.on('stateChange', (oldState, newState) => {
	console.log(`La conexión pasó de ${oldState.status} a ${newState.status}`);
});

player.on('stateChange', (oldState, newState) => {
	console.log(`Transición del reproductor de audio de ${oldState.status} a ${newState.status}`);
});
```
