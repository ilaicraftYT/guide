# Reproductor de audio

Los reproductores de audio se pueden utilizar para reproducir audio a través de conexiones de voz. Un solo reproductor de audio puede reproducir el mismo audio a través de múltiples conexiones de voz.

## Hoja de trucos

### Creación

Crear un reproductor de audio es simple:

```js
const { createAudioPlayer } = require('@discordjs/voice');

const player = createAudioPlayer();
```

También puede personalizar los comportamientos de un reproductor de audio. Por ejemplo, el comportamiento predeterminado es pausar cuando no hay suscriptores activos para un reproductor de audio. Este comportamiento se puede configurar para pausar, detener o simplemente continuar la reproducción a través de la transmisión:

```js
const { createAudioPlayer, NoSubscriberBehavior } = require('@discordjs/voice');

const player = createAudioPlayer({
	behaviors: {
		noSubscriber: NoSubscriberBehavior.Pause,
	},
});
```

### Supresión

Si ya no necesita un reproductor de audio, puede detenerlo usando `stop()` y luego eliminar las referencias a él para que se recolecte la basura

```js
player.stop();
```

### Reproducción de audio

Puede crear [recursos de audio](./audio-resources.md) y luego reproducirlos en un reproductor de audio.

```js
const resource = createAudioResource('/home/user/voice/track.mp3');
player.play(resource);

// Reproduce "track.mp3" a través de dos conexiones de voz
connection1.subscribe(player);
connection2.subscribe(player);
```

::: warning ADVERTENCIA
**Los reproductores de audio pueden reproducir un recurso de audio como máximo.** Si intenta reproducir otro recurso de audio mientras uno ya se está reproduciendo en el mismo reproductor, el existente se destruye y se reemplaza por el nuevo.
:::

### Pausar / reanudar

Puede llamar a los métodos `pause()` y `unpause()`. Mientras el reproductor de audio esté en pausa, no se reproducirá ningún audio. Cuando se reanude, continuará donde lo dejó.

```js
player.pause();

// Reanudar después de 5 segundos
setTimeout(() => player.unpause(), 5_000);
```

## Ciclo vital

Las conexiones de voz tienen su propio ciclo de vida, con cinco estados distintos. Puede seguir los métodos discutidos en la sección [ciclos de vida](/voice/life-cycles.md) para suscribirse a los cambios en las conexiones de voz.

- **Idle** - el estado inicial de un reproductor de audio. El reproductor de audio estará en este estado cuando no haya recursos de audio para reproducir.

- **Bufferring** - el estado en el que se encontrará un reproductor de audio mientras espera que se pueda reproducir un recurso de audio. El reproductor de audio puede pasar de este estado al estado `Playing` (éxito) o al estado `Idle` (fallo).

- **Playing** - el estado en el que entra una conexión de voz cuando está reproduciendo activamente un recurso de audio. Cuando el recurso de audio llega a su fin, el reproductor de audio pasará al estado `Idle`.

- **AutoPaused** - el estado en el que entrará una conexión de voz cuando el reproductor se haya detenido porque no hay conexiones de voz activas para reproducir. Esto solo es posible con el comportamiento `noSubscriber` configurado en `Pause`. Volverá automáticamente a `Playing` una vez que al menos una conexión vuelva a estar disponible.

- **Paused** - el estado en el que entra una conexión de voz cuando el usuario la detiene.

```js
const { AudioPlayerStatus } = require('@discordjs/voice');

player.on(AudioPlayerStatus.Playing, () => {
	console.log('The audio player has started playing!');
});
```

## Manejo de errores

Cuando un reproductor de audio recibe un recurso de audio para reproducir, propagará los errores del `recurso` de audio para que usted los maneje.

En el controlador de errores, puede elegir reproducir un nuevo `recurso` de audio o detener la reproducción. Si no realiza ninguna acción, el reproductor de audio se detendrá y volverá al estado `Idle`.

Además, el objeto de error también contendrá una propiedad de `recurso` que le ayudará a determinar qué recurso de audio creó el error.

A continuación, se muestran dos ejemplos diferentes de cómo puede manejar los errores.

### Tomando acción dentro del controlador de errores

En este ejemplo, el reproductor de audio solo pasará a reproducir el siguiente `recurso` de audio si se ha producido un error. Si la reproducción finaliza correctamente, no ocurrirá nada. Este ejemplo evita una transición al estado inactivo.

```js
const { createAudioResource } = require('@discordjs/voice');

const resource = createAudioResource('/home/user/voice/music.mp3', {
	metadata: {
		title: '¡Una buena canción!',
	},
});

player.play(resource);

player.on('error', error => {
	console.error(`Error: ${error.message} con el recurso ${error.resource.metadata.title}`);
	player.play(getNextResource());
});
```

### Actuando en el estado `Idle`

En este ejemplo, el evento de error se usa solo para fines de registro. El reproductor de audio pasará naturalmente al estado `Idle` y luego se reproducirá otro `recurso`. Esto tiene la ventaja de trabajar con streams que llegan a su fin con gracia y aquellos que son interrumpidos por errores.

```js
const { createAudioResource } = require('@discordjs/voice');

const resource = createAudioResource('/home/user/voice/music.mp3', {
	metadata: {
		title: '¡Una buena canción!',
	},
});

player.play(resource);

player.on('error', error => {
	console.error(error);
});

player.on(AudioPlayerStatus.Idle, () => {
	player.play(getNextResource());
});
```
