# Permisos de comando de barra

Los comandos de barra tienen su propio sistema de permisos, lo que le permite controlar quién tiene acceso para usar qué comandos. A diferencia de la configuración de permisos de los comandos de barra inclinada dentro del cliente de Discord, puede ajustar el acceso a los comandos sin evitar que el usuario o rol seleccionado use todos los comandos.

::: tip
Si establece `defaultPermission: false` al crear un comando, puede deshabilitarlo inmediatamente para todos, incluidos los administradores del gremio y usted mismo.
:::

## Permisos de usuario

Para comenzar, obtenga un `ApplicationCommand` y luego configure los permisos usando el método `ApplicationCommandPermissionsManager#add()`:

<!-- eslint-skip -->

```js
if (!client.application?.owner) await client.application?.fetch();

const command = await client.guilds.cache.get('123456789012345678')?.commands.fetch('876543210987654321');

const permissions = [
	{
		id: '224617799434108928',
		type: 'USER',
		permission: false,
	},
];

await command.permissions.add({ permissions });
```

Ahora ha denegado con éxito al usuario cuyo `id` utilizó el acceso a este comando de aplicación.

::: tip
Si desea actualizar los permisos para un comando global, su variable `comando` sería:
```js
const command = client.application?.commands.fetch('123456789012345678');
```
:::

Si tiene un comando que está deshabilitado de manera predeterminada y desea otorgar acceso a alguien para usarlo, haga lo siguiente:

<!-- eslint-skip -->

```js {5}
const permissions = [
	{
		id: '224617799434108928',
		type: 'USER',
		permission: true,
	},
];

await command.permissions.set({ permissions });
```


## Permisos para roles

Los permisos también se pueden denegar (o permitir) a un `rol` en lugar de un solo usuario:

<!-- eslint-skip -->

```js {4-5}
const permissions = [
	{
		id: '464464090157416448',
		type: 'ROLE',
		permission: false,
	},
];

await command.permissions.add({ permissions });
```

## Permisos de actualización masiva

Si tiene muchos comandos, es probable que desee actualizar sus permisos de una vez en lugar de uno por uno. Para este enfoque, puede utilizar el método `ApplicationCommandPermissionsManager#set()`:

<!-- eslint-skip -->

```js
const fullPermissions = [
	{
		id: '123456789012345678',
		permissions: [{
			id: '224617799434108928',
			type: 'USER',
			permission: false,
		}],
	},
	{
		id: '876543210987654321',
		permissions: [{
			id: '464464090157416448',
			type: 'ROLE',
			permission: true,
		}],
	},
];

await client.guilds.cache.get('123456789012345678')?.commands.permissions.set({ fullPermissions });
```

¡Y eso es todo lo que necesita saber sobre los permisos en comandos de barra!
