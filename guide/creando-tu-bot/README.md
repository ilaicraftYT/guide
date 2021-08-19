# Poniendo en marcha tu bot

¡Por fin llegamos a las partes más emocionantes! ¡Ya que tu bot está en tu servidor, el siguiente paso es iniciar a programar y encenderlo!

## Creando el archivo del bot

Abre tu editor de código preferido (Puede ser [Visual Studio Code](https://code.visualstudio.com/), [Atom](https://atom.io/), [Sublime Text](https://www.sublimetext.com/), o cualquier otro editor de tu elección) y crea un nuevo archivo. Si eres nuevo en esto y no estás seguro sobre cuál usar, usa Visual Studio Code.

Es preferible que guardes el archivo como `index.js`, pero puedes nombrarlo como desees, mientras termine con `.js`.

::: tip
Puedes crear un archivo rápidamente usando el atajo `Ctrl + N` en tu teclado y `Ctrl + S` para guardar el archivo.
:::

## Iniciando sesión en Discord

Una vez hayas creado el nuevo archivo, haz una revisión rápida para ver que hayas hecho todo correctamente. Copia y pega el siguiente código en tu archivo y guárdalo. No te preocupes si no lo entiendes, lo explicaremos más a profundidad después de esto.


```js
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('¡Estoy listo!');
});

client.login('tu-token-va-aquí');
```

Abre la consola en una nueva ventana con `Ctrl + Shift + C`, escribe `node nombre-del-archivo.js`, y presiona enter. Si ves el mensaje `¡Estoy listo!` luego de unos segundos, ¡Todo funcionó correctamente! Si no, vuelve un par de pasos atras y revisa que hayas seguido todo correctamente.


::: tip
¿No te gusta escribir el nombre de tu archivo a cada rato? Abre tu archivo `package.json`, busca algo como `"main": "index.js"`, y cambia `"index.js"` por el nombre de tu archivo. ¡Luego de guardarlo podrás usar `node .` como atajo en la consola para iniciar tu bot!
:::

### Código de inicio explicado

Aquí está el mismo código con comentarios, así será más fácil entender lo que estás haciendo.
```js
// requieres las clases necesarias de discord.js
const { Client, Intents } = require('discord.js');

// creas un nuevo cliente de Discord
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// cuando el cliente está listo, ejecuta este código
// este evento solo se ejecutará una vez luego de iniciar sesión
client.once('ready', () => {
	console.log('¡Estoy listo!');
});

// Inicia sesión con el token de tu app de Discord
client.login('tu-token-va-aquí');
```

Aunque no sea mucho, es bueno saber que hace cada parte de tu código. Pero, como está actualmente, esto no hará nada. Probablemente quieras añadir algunos comandos que se ejecuten cuando alguien usa uno de ellos, ¿No? ¡Empecemos con eso entonces!

## Escuchando las interacciones

Primero, asegúrate de apagar el bot en tu consola. Puedes hacerlo presionando `Ctrl + C` dentro de la consola. Vuelve a tu editor de código y añade lo siguiente arriba de la línea del `client.login()`.

```js
client.on('interactionCreate', interaction => {
	console.log(interaction);
});
```

Fíjate como el código usa `.on` en vez de `.once` como en el evento ready. Esto significa que puede ser ejecutado múltiples veces. Guarda el archivo, vuelve a tu consola e inicia el bot nuevamente. Cuando una interacción sea recibida, aparecerá en la consola. ¡Vé y pruebalo!

::: tip
Dentro de la consola, puedes presionar las flechas de tu teclado para ver los comandos que haz usado reciéntemente. Presionar la flecha `Arriba` y `Enter` luego de apagar el bot, es una forma conveniente y rápida de encenderlo nuevamente (en vez de escribir el nombre a cada rato).
:::

::: tip
Para aprender cómo crear y recibir comandos slash (`/`), lee la [sección de interacciones](/interacciones/registrando-comandos-de-barra.html).
:::

## Resultado final

<ResultingCode path="creando-tu-bot/en-marcha" />
