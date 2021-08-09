# Archivos de configuración

::: tip
Esta página es una continuación y se basa en el código de la [página anterior](/creating-your-bot/)
:::

Mientras más te profundices en el desarrollo, necesitarás interactuar con datos sensibles o datos que son usados en múltiples lugares, así como:

* Contraseñas de bases de datos
* Llaves de APIs
* Una lista de las Ids de los dueños del bot

Tener ese tipo de datos en cada uno de tus archivos, puede ser molesto y menos de lo ideal. Aquí es donde los archivos de configuración entran–son un gran lugar para almacenar datos estáticos que puedes actualizar fácilmente en un solo lugar.

## Implementando un archivo de configuración

Ve a tu editor de código y crea un nuevo archivo. Añade el código que está abajo y guárdalo como `config.json`, en la misma carpeta en la que está el archivo principal de tu bot.

```json
{
	"token": "tu-token-va-aquí"
}
```

Vuelve al archivo principal de tu bot, encuentra la línea del `const client = new Client()` y añade esto arriba:

```js
const { token } = require('./config.json');
```

Ahora, copia tu token de la línea del `client.login('tu-token-va-aquí')` y pégala en el archivo `config.json`. Asegúrate de ponerla entre comillas.

¡Ahora simplemente puedes hacer `client.login(token)` para iniciar sesión!

## Almacenando datos adicionales

Como mencionamos anteriormente, probablemente quieras almacenar más datos que solo tu token en algún punto u otro. ¡Si almacenarás más datos, añade otro par de llave/valor a la lista!

```json
{
	"token": "tu-token-va-aquí",
	"significado_de_la_vida": 42,
	"array_de_contraseñas": ["por", "favor", "no", "me", "hackees"],
	"codigos_secretos": {
		"banco": 1234,
		"casa": 4321
	}
}
```

## Resultado final

<ResultingCode />
