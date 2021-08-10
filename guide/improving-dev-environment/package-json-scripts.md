# Configuración de los scripts en el package.json
La manera más fácil de ejecutar un script como un script para iniciar tu bot, un script para lint para los archivos de tu bot, o cualquier script que uses almacenándolos en el archivo `package.json`. Después de almacenar estos scripts en su archivo `package.json`, puede ejecutar `npm run start` para iniciar tu bot o `npm run lint` para lint para los archivos de tu bot.

## Empezando

::: tip
Antes de comenzar, necesitarás un archivo `package.json`. Si aún no tienes un archivo `package.json`, puede ejecutar `npm init -y` en la consola para crear uno.
:::

Si aún no ha tocado su archivo `package.json` (excluyendo las dependencias de instalación), su archivo` package.json` debería tener un aspecto similar al siguiente:

```json
{
	"name": "my-bot",
	"version": "1.0.0",
	"description": "¡Un bot de Discord!",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1"
	},
	"keywords": [],
	"author": "",
	"license": "ISC"
}
```

Veamos más de cerda. Abajo de `main`, veras `scripts`. Puedes especificar tus scripts ahí. En esta guia, le mostraremos cómo iniciar y lint su bot usando un script `package.json`.

## Agregando tu primer script

::: tip
Asumiremos que ya terminaste la sección: [creando tu primer bot](/creating-your-bot/) de la guía. ¡Si no lo has hecho, asegúrate de seguirlo primero!
:::

En su archivo `package.json`, agregue la siguiente línea en la sección de `scripts`:

```json
"start": "node ."
```

::: tip
El script `node .` ejecutara el archivo que especificaste en la entrada `main` de tu archivo `package.json`. Si aún no lo tiene configurado, ¡asegúrese de seleccionar el archivo principal de su bot como `main`!
:::

Ahora, cada vez que ejecutes el script `npm run start` en el directorio de tu bot, ejecutara el comando `node .`. Creemos otra secuencia de comandos para lint tu código a través de la línea de comando.

::: tip
Si no tiene ESLint instalado globalmente, puede usar [npx](https://alligator.io/workflow/npx/) para ejecutar el script ESLint para su directorio local. Para más información del como configurarlo, puedes leer la página oficial [aquí](https://alligator.io/workflow/npx/).
:::
Agrega la siguiente línea a tus scripts:

```json
"lint": "eslint ."
```

Ahora, cada vez que ejecutes el script `npm run lint`, ESLint lint tu archivo `index.js`.

Tu archivo `package.json` ahora debería tener un aspecto similar al siguiente:

```json
{
	"name": "my-bot",
	"version": "1.0.0",
	"description": ¡Un bot de Discord!",
	"main": "index.js",
	"scripts": {
		"test": "echo \"Error: no test specified\" && exit 1",
		"start": "node .",
		"lint": "eslint ."
	},
	"keywords": [],
	"author": "",
	"license": "ISC"
}
```

¡Y eso es todo! Siempre puedes agregar más scripts ahora, ejecutándolos con `npm run script-name`.
