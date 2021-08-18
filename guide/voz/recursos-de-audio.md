# Recursos de audio

Los recursos de audio contienen audio que un reproductor de audio puede reproducir en conexiones de voz.

## Hoja de trucos

### Creación

Hay muchas formas de crear un recurso de audio. A continuación se muestran algunos escenarios de ejemplo:

```js
const { createReadStream } = require('fs');
const { join } = require('path');
const { createAudioResource, StreamType } = require('@discordjs/voice');

// Las opciones básicas predeterminadas son:
// Se desconoce el tipo de entrada, por lo que usará FFmpeg para convertir a Opus bajo cubierta
// El volumen en línea está habilitado para mejorar el rendimiento
let resource = createAudioResource(join(__dirname, 'file.mp3'));

// Utilizará FFmpeg con el control de volumen habilitado
resource = createAudioResource(join(__dirname, 'file.mp3'), { inlineVolume: true });
resource.volume.setVolume(0.5);

// Reproducirá archivos .ogg o .webm Opus sin FFmpeg para un mejor rendimiento
// Recuerde, el volumen en línea todavía está deshabilitado
resource = createAudioResource(createReadStream(join(__dirname, 'file.ogg'), {
	inputType: StreamType.OggOpus,
}));

// Reproducirá con FFmpeg debido a que el volumen en línea está habilitado.
resource = createAudioResource(createReadStream(join(__dirname, 'file.webm'), {
	inputType: StreamType.WebmOpus,
	inlineVolume: true,
}));

player.play(resource);
```

### Supresión

Las transmisiones subyacentes de un recurso de audio se destruyen y eliminan una vez que un reproductor de audio termina de reproducir su audio. Asegúrese de eliminar cualquier referencia que haya creado al recurso para evitar pérdidas de memoria.

## Manejo de errores

Para la mayoría de los escenarios, creará un recurso de audio para uso inmediato por parte de un reproductor de audio. El reproductor de audio propagará los errores del recurso por usted, por lo que puede adjuntar controladores de `error` al reproductor en lugar del recurso.

```js
const { createAudioResource, createAudioPlayer } = require('@discordjs/voice');

const player = createAudioPlayer();
// Un AudioPlayer siempre emitirá un evento de "error" con una propiedad .resource
player.on('error', error => {
	console.error('Error:', error.message, 'con la pista', error.resource.metadata.title);
});

const resource = createAudioResource('/home/user/voice/music.mp3', {
	metadata: {
		title: '¡Una buena canción!',
	},
});
player.play(resource);
```

Sin embargo, también puede adjuntar un controlador de errores específicamente al recurso de audio si lo desea. Esto **no ser recomienda**, ya que no se le permite cambiar el estado de un reproductor de audio desde los controladores de errores de un recurso de audio (por otro lado, puede hacer esto desde el controlador de errores de un reproductor de audio, como se muestra arriba.)

```js
const { createAudioResource, createAudioPlayer } = require('@discordjs/voice');

const player = createAudioPlayer();

const resource = createAudioResource('/home/user/voice/music.mp3', {
	metadata: {
		title: '¡Una buena canción!',
	},
});

// No recomendado: ¡escuche los errores del reproductor de audio en la mayoría de los casos de uso!
resource.playStream.on('error', error => {
	console.error('Error:', error.message, 'con la pista', resource.metadata.title);
});

player.play(resource);
```

## Optimizaciones

Para mejorar el rendimiento, puede considerar los siguientes métodos. Reducen la demanda computacional requerida para reproducir audio y podrían ayudar a reducir la fluctuación en el flujo de audio.

### No usar volumen en línea

De forma predeterminada, el volumen en línea está deshabilitado por motivos de rendimiento. Habilitarlo le permitirá modificar el volumen de su transmisión en tiempo real. Esto tiene un costo de rendimiento, incluso si en realidad no está modificando el volumen de su transmisión.

Asegúrese de considerar si vale la pena habilitarlo para su caso de uso.

### Reproducir transmisiones de Opus

Si está reproduciendo repetidamente el mismo recurso, puede considerar convertirlo a Ogg opus u WebM opus. Alternativamente, si está obteniendo un recurso externo y puede especificar un formato en el que le gustaría transmitir el recurso, debería considerar especificar Ogg opus u WebM opus.

La razón de esto es que puede eliminar FFmpeg del proceso de transmisión de audio. FFmpeg se usa para convertir entradas desconocidas en audio Opus que se puede transmitir a Discord. Si su audio ya está en el formato Opus, esto elimina una de las partes más exigentes computacionalmente de la canalización de audio del proceso de transmisión, lo que seguramente mejoraría el rendimiento.

Los dos ejemplos siguientes omitirán el componente FFmpeg de la carga para mejorar el rendimiento.

```js
const { createReadStream } = require('fs');
const { createAudioResource, StreamType } = require('@discordjs/voice');

let resource = createAudioResource(createReadStream('mi_archivo.ogg'), {
	inputType: StreamType.OggOpus,
});

resource = createAudioResource(createReadStream('mi_archivo.webm'), {
	inputType: StreamType.WebmOpus,
});
```

:::warning
Esta optimización es útil si no desea utilizar el volumen en línea. Habilitar el volumen en línea deshabilitará la optimización.
:::

### Pruebas para determinar el tipo de stream

La biblioteca de voz también puede determinar si una transmisión legible es una transmisión Ogg/Opus o WebM/Opus. Esto significa que aún puede obtener los beneficios de rendimiento que vienen con la reproducción de una transmisión de Opus, incluso si no está seguro de avance el tipo de flujo de audio que va a reproducir.

Esto se logra probando una pequeña parte del comienzo del flujo de audio para ver si es adecuado para la multiplicación:

```js
const { createReadStream } = require('fs');
const { demuxProbe, createAudioResource } = require('@discordjs/voice');

async function probeAndCreateResource(readableStream) {
	const { stream, type } = await demuxProbe(readableStream);
	return createAudioResource(stream, { inputType: type });
}

async function createResources() {
	// Crea un recurso de audio con inputType = StreamType.Arbitrary
	const mp3Stream = await probeAndCreateResource(createReadStream('file.mp3'));

	// Crea un recurso de audio con inputType = StreamType.OggOpus
	const oggStream = await probeAndCreateResource(createReadStream('file.ogg'));

	// Crea un recurso de audio con inputType = StreamType.WebmOpus
	const webmStream = await probeAndCreateResource(createReadStream('file.webm'));
}

createResources();
```
