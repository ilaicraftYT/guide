# Introducción

"Voz" se refiere a que los bots de Discord pueden enviar audio en canales de voz. Esto es compatible con discord.js a través de [@discordjs/voice](https://github.com/discordjs/voice), una biblioteca independiente creada por los desarrolladores de discord.js. Si bien puede usarlo con cualquier biblioteca de API de Discord de Node.js, esta guía se centrará en usarlo con discord.js.

## Instalación

### Esqueleto

Para agregar funcionalidad de voz a su bot discord.js, necesitará el paquete `@discordjs/voice`, así como uno de los paquetes de cifrado que se enumeran a continuación. Por ejemplo:

```bash
npm install @discordjs/voice libsodium-wrappers
```

Después de esto, podrá reproducir archivos Ogg y WebM Opus sin ninguna otra dependencia. Si desea reproducir audio de otras fuentes o desea mejorar el rendimiento, considere instalar algunas de las dependencias adicionales que se enumeran a continuación.

::: warning ADVERTENCIA
Esta guía asume que ha instalado al menos una dependencia adicional: FFmpeg. Puede encontrar más información sobre esto en la sección siguiente.
:::

### Dependencias adicionales

- Una biblioteca de codificación Opus
  - [`@discordjs/opus`](https://github.com/discordjs/opus) (mejor rendimiento)
  - [`opusscript`](https://github.com/abalabahaha/opusscript/)
- FFmpeg – le permite reproducir una variedad de medios (e.g. MP3s).
  - [`ffmpeg`](https://ffmpeg.org/) - instalar y agregar al entorno de su sistema
  - [`ffmpeg-static`](https://www.npmjs.com/package/ffmpeg-static) - para instalar FFmpeg a través de npm
- Paquetes de cifrado
  - [`sodium`](https://www.npmjs.com/package/sodium) (mejor rendimiento)
  - [`libsodium-wrappers`](https://www.npmjs.com/package/libsodium-wrappers)
  - [`tweetnacl`](https://www.npmjs.com/package/tweetnacl)

::: tip
Fuera de un entorno de desarrollo, se recomienda que utilice `@discordjs/opus` y `sodium` para mejorar el rendimiento y la estabilidad de la reproducción de audio.

Si tiene dificultades para instalar estas dependencias, asegúrese de tener instaladas las herramientas de compilación primero. En Windows, esto es tan fácil como ejecutar `npm install --global --production --vs2015 --add-python-to-path windows-build-tools`
:::

## Dependencias de depuración

La biblioteca incluye una función auxiliar que le ayuda a averiguar qué dependencias ha instalado correctamente. Esta información también es muy útil si alguna vez necesita enviar un problema en el rastreador de problemas `@discordjs/voice`.

```js
const { generateDependencyReport } = require('@discordjs/voice');

console.log(generateDependencyReport());

/*
--------------------------------------------------
Core Dependencies
- @discordjs/voice: 0.3.1
- prism-media: 1.2.9

Opus Libraries
- @discordjs/opus: 0.5.3
- opusscript: not found

Encryption Libraries
- sodium: 3.0.2
- libsodium-wrappers: not found
- tweetnacl: not found

FFmpeg
- version: 4.2.4-1ubuntu0.1
- libopus: yes
--------------------------------------------------
*/
```

- **Dependencias principales**
  - Estas son dependencias que definitivamente deberían estar disponibles.
- **Bibliotecas Opus**
  - Si desea reproducir audio de muchos tipos de archivos diferentes o alterar el volumen en tiempo real, necesitará uno de estos.
- **Bibliotecas de cifrado**
  - Debe tener al menos una biblioteca de cifrado instalada para usar `@discordjs/voice`.
- **FFmpeg**
  - Si desea reproducir audio de muchos tipos de archivos diferentes, deberá tener FFmpeg instalado.
  - Si `libopus` está habilitado, podrá beneficiarse de un mayor rendimiento si la alteración de volumen en tiempo real está deshabilitada.
