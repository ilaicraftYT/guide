# Instalación de Node.js y discord.js

## Instalación de Node.js

Para usar discord.js, deberá instalar Node.js. Puedes hacerlo yendo al [sitio web de Node.js](https://nodejs.org/).

### Instalación en Windows

Si está desarrollando en Windows, es tan simple como instalar cualquier otro programa. Ve al [sitio web de Node.js](https://nodejs.org/), descargue la última versión, abra el archivo descargado y siga los pasos del instalador.

### Instalación en macOS

Si está desarrollando en macOS, tiene algunas opciones. Puedes ir al [sitio web de Node.js](https://nodejs.org/), descargue la última versión, haga doble clic en el instalador del paquete y siga las instrucciones. O puede usar un administrador de paquetes como [Homebrew](https://brew.sh/) con el comando `brew install node`.

### Instalación en Linux

Si está desarrollando en Linux, puede consultar [esta página](https://nodejs.org/en/download/package-manager/) para determinar cómo debe instalar Node.<br />En esa nota, existe la posibilidad de que ya tenga Node \(por ejemplo, si está usando un VPS\). Puede comprobarlo ejecutando el comando `node -v`. Si genera algo como `v16.6` o superior, ¡está listo para comenzar! De lo contrario, consulte la página vinculada anteriormente para obtener instrucciones sobre cómo instalar Node en su sistema operativo.

::: warning ADVERTENCIA
Si _tiene_ Node instalado, pero tiene una versión anterior \(es decir, cualquier cosa por debajo de 16.6\), debe actualizar a la última versión. discord.js v13 requiere Node 16.6 o superior.
:::

---

## Preparando lo esencial

Para instalar y usar discord.js, deberá instalarlo a través de npm \(administrador de paquetes de Node\). npm viene con cada instalación de Node, por lo que no tiene que preocuparse por instalarlo. Sin embargo, antes de instalar nada, debe configurar una nueva carpeta de proyecto.

### Configurar una carpeta de proyecto

Como cualquier otro proyecto, debe tener una carpeta dedicada para mantenerlo organizado y manejable.

Diríjase a un lugar de su máquina que sea fácil de encontrar y vuelva a abrir en el futuro por razones de conveniencia. Cree una nueva carpeta como lo haría normalmente (dependiendo de su sistema operativo, puede usar `mkdir project-name` dentro de su terminal).  Si ya tiene un nombre que desea usar para su bot, puede usarlo como nombre de carpeta. De lo contrario, puede nombrarlo algo como `discord-bot` por el momento \(o cualquier otra cosa que tenga en mente\).

Una vez que haya terminado de crear la carpeta, ábrala (dependiendo de su sistema operativo, puede usar `cd project-name` dentro de su terminal).

### Abriendo el símbolo del sistema

Si está en Linux, puede abrir rápidamente la terminal con `Ctrl + Alt + T`.

Si está en Windows y no está familiarizado con la apertura del símbolo del sistema, haga lo siguiente:

1. Abra la carpeta del proyecto de su bot.
2. Mantenga presionada la tecla "Shift" y haga clic derecho dentro de la carpeta.
3. Elija la opción "Abrir ventana de comando aquí".

### Usando el símbolo del sistema

Con el símbolo del sistema abierto, ejecute el comando `node -v` para asegurarse de haber instalado correctamente Node.js. Si ve algo como `v16.6` o superior, ¡genial! Si no es así, regrese e intente instalar nuevamente.

El siguiente comando que ejecutará es `npm init`. Este comando crea un archivo `package.json` para usted, que hará un seguimiento de las dependencias que usa su bot y otra información. Si está un poco confundido por eso, puede ignorarlo por el momento.

El comando `npm init` le hará una secuencia de preguntas; debe completarlas como mejor le parezca. Si no está seguro de algo o desea omitirlo en su totalidad, déjelo en blanco y presione Intro.

::: tip
¿Quiere empezar rápidamente? Use `npm init -y` para que complete todo por usted.
:::

Una vez que haya terminado con eso, ¡estará listo para instalar discord.js!

---

## Instalación de discord.js

Ahora que ha instalado Node.js y sabe cómo abrir su consola y ejecutar comandos, ¡finalmente puede instalar discord.js!

Para instalar discord.js, ejecute `npm install discord.js`. Esto puede llevar un poco de tiempo, pero debería terminar con bastante rapidez.

¡Y eso es! Con todas las necesidades instaladas, está casi listo para comenzar a codificar su bot.

---

## Instalación de un linter

Mientras codifica, es posible que se encuentre con numerosos errores de sintaxis o codifique con un estilo incoherente. Debe instalar un linter para aliviar estos problemas. Si bien los editores de código generalmente pueden señalar errores de sintaxis, con un linter, puede forzar su codificación para que tenga un estilo específico según lo defina en la configuración. Si bien esto no es obligatorio, es recomendable. [¡Haga clic aquí para obtener la guía de linter!](/preparations/setting-up-a-linter.md)
