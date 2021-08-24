# Manipulación de imágenes con Canvas

## Configuración de Canvas

Canvas es una herramienta de manipulación de imágenes que le permite modificar imágenes con código. Exploraremos cómo usar este módulo en un comando de barra para hacer un comando de perfil. Pero primero, debe pasar por la intensa labor de instalar Canvas. Se recomienda encarecidamente que utilice una distribución de Linux para esto porque será mucho más fácil de instalar.

::: tip
Esta guía se probó por última vez con `canvas^2.8.0`, así que asegúrese de tener esta o una versión similar después de la instalación.
:::

::: warning ADVERTENCIA
Asegúrese de estar familiarizado con cosas como [async/await](/informacion-adicional/async-await.md) y [desestructuración de objetos](/informacion-adicional/sintaxis-ES6.html#desestructuracion-de-objetos) antes de continuar, ya que utilizaremos funciones como estas.
:::

## Instalación

### Windows

Necesitará un paquete llamado Windows Build Tools. Para instalar esto, abra Powershell como administrador. Luego puede instalarlo con npm (`npm i --global --production windows-build-tools`) o Yarn (` yarn global add --production windows-build-tools`). También se incluye con Chocolatey, en caso de que elija esa ruta de instalación.

Luego, debe seguir las instrucciones detalladas [aquí](https://github.com/Automattic/node-canvas/wiki/Installation:-Windows). Además, asegúrese de que Node y Cairo sean **ambos**  de 32 bits o de 64 bits; tener una versión de 32 bits de uno y una versión de 64 bits del otro provocará errores. 

Si *todavía* no puede instalar Canvas, considere instalar de [Microsoft Visual Studio 2015](https://www.visualstudio.com/vs/older-downloads/).

### Otras distribuciones

Puede ejecutar uno de los comandos enumerados [aquí](https://github.com/Automattic/node-canvas#compiling) para instalar las herramientas necesarias que Canvas necesita.

### Instalación del paquete

Después de instalar todo el software necesario, ejecute `npm i canvas` si usa npm o` yarn add canvas` si usa Yarn.

## Empezando

Aquí está el código base que usará para comenzar:

```js
const { Client, Intents, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', () => {
	console.log('¡Listo!');
});

client.on('interactionCreate', interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'profile') {
		// ...
	}
});

client.login('tu-token-va-aquí');
```

::: warning ADVERTENCIA
Recuerde registrar los comandos de barra antes de continuar con esta sección de la guía. Puede ver cómo hacerlo [aquí](/interacciones/registrando-comandos-de-barra.md).
:::

### Carga básica de imágenes

El objetivo final será mostrar el avatar y el apodo del usuario.

Después de importar el módulo Canvas e inicializarlo, debe cargar las imágenes. Con Canvas, primero debe especificar de dónde proviene la imagen, naturalmente, y luego especificar cómo se carga en el Canvas real usando el "contexto", que usará para interactuar con Canvas.

::: tip
`canvas` funciona casi idéntico a HTML5 Canvas. Puede leer los tutoriales de HTML5 Canvas en [MDN](https://developer.mozilla.org/es/docs/Web/API/Canvas_API) para obtener más información!
:::

```js {5-8}
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'profile') {
		// Crea un Canvas de 700x250 píxeles y obtén su contexto
		// El contexto se usará para modificar el Canvas
		const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');
		// ...
	}
});
```

Ahora, debe cargar la imagen que desea usar en Canvas. Para tener suficiente cobertura, primero le mostraremos cómo cargar una imagen básica desde un directorio local. Usaremos [esta imagen](https://github.com/Awoocado/guide/blob/main/guide/temas-populares/images/canvas.jpg) como fondo en la imagen de bienvenida, pero puedes usar lo que quieras. Asegúrese de descargar el archivo, asígnele el nombre `wallpaper.jpg` y guárdelo dentro del mismo directorio que su archivo bot principal. 

```js {5-14}
client.on('interactionCreate', async interaction => {
	// ...
	const context = canvas.getContext('2d');

	// Dado que la imagen tarda en cargarse, debe esperarla.
	const background = await Canvas.loadImage('./wallpaper.jpg');

	// Esto usa las dimensiones del canvas para estirar la imagen en todo el canvas.
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Utilice la útil estructura de clases Attachment para procesar el archivo por usted
	const attachment = new MessageAttachment(canvas.toBuffer(), 'imagen-perfil.png');

	interaction.reply({ files: [attachment] });
});
```

![Vista previa del canvas básico](./images/canvas-preview.png)

::: tip
Si recibe un error como `Error: error while reading from input stream`, entonces la ruta proporcionada por el archivo era incorrecta.
:::

### Manipulando imagenes

A continuación, coloquemos un borde alrededor de la imagen con fines de demostración.

```js {5-9}
client.on('interactionCreate', async interaction => {
	// ...
	context.drawImage(background, 0, 0, canvas.width, canvas.height);

	// Establecer el color del trazo
	context.strokeStyle = '#0099ff';

	// Dibuja un rectángulo con las dimensiones de todo el canvas.
	context.strokeRect(0, 0, canvas.width, canvas.height);
	// ...
});
```

![Imagen del canvas](./images/canvas-plain.png)

Un poco sencillo, ¿Verdad? No temas, porque tienes un poco más que hacer hasta que lo completes. Dado que el objetivo de esta página de guía se centra más en el código real que en el diseño, coloquemos un avatar básico de forma cuadrada por ahora en el lado izquierdo de la imagen. Luego lo convertira en un círculo.

```js {5-9}
client.on('interactionCreate', async interaction => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Espere a que Canvas cargue la imagen
	const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg' }));

	// Dibuja una forma en el canvas principal
	context.drawImage(avatar, 25, 0, 200, canvas.height);
	// ...
});
```

![Imagen del Canvas](./images/canvas-stretched-avatar.png)

Funciona bien, pero la imagen del avatar en sí parece un poco estirada. Pongamos remedio a eso.

```js {5-6}
client.on('interactionCreate', async interaction => {
	// ...
	const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg' }));

	// Mueva la imagen hacia abajo verticalmente y restrinja su altura a 200, para que quede cuadrada
	context.drawImage(avatar, 25, 25, 200, 200);
	// ...
});
```

![Imagen del canvas](./images/canvas-square-avatar.png)

El propósito de esta pequeña sección es demostrar que trabajar con Canvas es esencialmente un flujo de trabajo impredecible en el que se juega con las propiedades hasta que funcionan correctamente.

Dado que cubrimos cómo cargar imágenes externas y corregir dimensiones, convierta el avatar en un círculo para mejorar el estilo general de la imagen.

```js {5-15}
client.on('interactionCreate', async interaction => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Obtén el bolígrafo
	context.beginPath();

	// Comienza el arco para formar un círculo.
	context.arc(125, 125, 100, 0, Math.PI * 2, true);

	// Baja el bolígrafo
	context.closePath();

	// Recorta la región en la que dibujaste
	context.clip();
	// ...
});
```

![Imagen del canvas](./images/canvas-circle-avatar.png)

::: tip
Puedes leer más sobre `context.arc()`en [MDN](https://developer.mozilla.org/es/docs/Web/API/CanvasRenderingContext2D/arc).
:::

### Añadiendo texto

Ahora, repasemos rápidamente cómo agregar texto a su imagen. Esto ayudará a que el propósito de esta imagen sea evidente, ya que actualmente, es solo un avatar flotando sobre un fondo estrellado que sale de la nada.

```js {5-12}
client.on('interactionCreate', async interaction => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Seleccione el tamaño y el tipo de fuente de una de las fuentes disponibles de forma nativa
	context.font = '60px sans-serif';

	// Seleccione el estilo que se utilizará para rellenar el texto
	context.fillStyle = '#ffffff';

	// Actualmente llene el texto con un color sólido
	context.fillText(interaction.member.displayName, canvas.width / 2.5, canvas.height / 1.8);
	// ...
});
```

![Image](./images/canvas-add-name.png)

::: tip
Si recibe un error como `Error de Fontconfig: error: Cannot load default config file`, significa que no tiene ninguna fuente instalada en su sistema. En Linux, puede ejecutar el siguiente comando para solucionar este problema: `sudo apt-get install fontconfig`. También es posible que deba instalarlo si ve cuadros donde debería estar el texto. En cuanto a Windows, deberá encontrar una forma de instalar fuentes.
:::

Es posible que haya notado o considerado que si el nombre de usuario de un miembro es demasiado largo, el resultado no será muy bueno. Esto se debe a que el texto se desborda del canvas y no tiene medidas para eso. ¡Ocupémonos de este problema!

```js {1-16,22-25}
// Pase todo el objeto Canvas porque necesitará acceso a su ancho y contexto
const applyText = (canvas, text) => {
	const context = canvas.getContext('2d');

	// Declare un tamaño base de la fuente
	let fontSize = 70;

	do {
		// Asignar la fuente al contexto y disminuirla para que se pueda medir nuevamente
		context.font = `${fontSize -= 10}px sans-serif`;
		// Compare el ancho de píxel del texto con el canvas menos el tamaño aproximado del avatar
	} while (context.measureText(text).width > canvas.width - 300);

	// Devuelve el resultado para usarlo en el canvas real
	return context.font;
};

client.on('interactionCreate', async interaction => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Asignar la fuente decidida al canvas
	context.font = applyText(canvas, interaction.member.displayName);
	context.fillStyle = '#ffffff';
	context.fillText(interaction.member.displayName, canvas.width / 2.5, canvas.height / 1.8);
	// ...
});
```

Antes del ajuste:

![Antes del ajuste](./images/canvas-before-text-wrap.png)

Después del ajuste:

![Despues del ajuste](./images/canvas-after-text-wrap.png)

Movamos el texto de bienvenida dentro de la propia imagen en lugar de agregarlo afuera como un buen toque final.

```js {5-8,10-13}
client.on('interactionCreate', async interaction => {
	// ...
	context.strokeRect(0, 0, canvas.width, canvas.height);

	// Texto un poco más pequeño colocado encima del nombre para mostrar del miembro
	context.font = '28px sans-serif';
	context.fillStyle = '#ffffff';
	context.fillText('Perfil', canvas.width / 2.5, canvas.height / 3.5);

	// Agregue un signo de exclamación aquí y debajo
	context.font = applyText(canvas, `${interaction.member.displayName}!`);
	context.fillStyle = '#ffffff';
	context.fillText(`¡${interaction.member.displayName}!`, canvas.width / 2.5, canvas.height / 1.8);
	// ...
});
```

![Resultado Final](./images/canvas-final-result.png)

¡Y eso es! Hemos cubierto los conceptos básicos de manipulación de imágenes, generación de texto y carga desde una fuente remota.

## Código resultante

<ResultingCode />
