# Hilos

Los hilos se pueden considerar como subcanales temporales dentro de un canal existente, para ayudar a organizar mejor la conversación en un canal ocupado.

## Eventos de Gateway relacionados con hilos

::: tip
¡Puedes usar `isThread()` para asegurarte de que un canal sea un canal de hilo!
:::

Los hilos introducen una serie de nuevos eventos de Gateway, que se enumeran a continuación:

- `Client#threadCreate`: Emitido cada vez que se crea un hilo o cuando el usuario cliente se agrega a un hilo.
- `Client#threadDelete`: Se emite cada vez que se elimina un hilo.
- `Client#threadUpdate`: Se emite cada vez que se actualiza un hilo (por ejemplo, cambio de nombre, cambio de estado de archivo, cambio de estado bloqueado).
- `Client#threadListSync`: Emitido cada vez que el usuario del cliente obtiene acceso a un canal de texto o noticias que contiene hilos.
- `Client#threadMembersUpdate`: Emitido cada vez que se agregan o eliminan miembros de un hilo. Requiere la intención privilegiada `GUILD_MEMBERS`.
- `Client#threadMemberUpdate`: Se emite cada vez que se actualiza el miembro del hilo del usuario del cliente.

## Crear y eliminar hilos

Los hilos se crean y eliminan usando el `ThreadManager` de un canal de texto o noticias.
Para crear un hilo, llama al método `ThreadManager#create()`:

<!-- eslint-skip -->

```js
const thread = await channel.threads.create({
	name: 'food-talk',
	autoArchiveDuration: 60,
	reason: '¿Palta o Aguacate? Debate serio, abro hilo.',
});

console.log(`Hilo creado: ${thread.name}`);
```
Para eliminar un hilo, usa el método `ThreadChannel#delete()`:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find(x => x.name === 'food-talk');
await thread.delete();
```

## Unir y dejar hilos

Para unir tu bot a un canal de hilo, usa el método `ThreadChannel#join()`:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find(x => x.name === 'food-talk');
if (thread.joinable) await thread.join();
```

Y para dejar uno, usa `ThreadChannel#leave()`;

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find(x => x.name === 'food-talk');
await thread.leave();
```
## Archivar, desarchivar y bloquear hilos

Un hilo puede estar activo o archivado. Cambiar un hilo de archivado a activo se conoce como desarchivar el hilo. Los hilos "bloqueados" solo pueden ser administrados por un miembro con el permiso "MANAGE_THREADS".

Los hilos se archivan automáticamente después de un tiempo de inactividad. "Actividad" se define como enviar un mensaje, desarchivar un hilo o cambiar la hora del archivo automático.

Para archivar o desarchivar un hilo, usa el método `ThreadChannel#setArchived()` y pase un parámetro booleano:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find(x => x.name === 'food-talk');
await thread.setArchived(true); // archivado
await thread.setArchived(false); // desarchivado
```


Este mismo principio se aplica al bloqueo y desbloqueo de un hilo a través del método `ThreadChannel#setLocked()`:

<!-- eslint-skip -->

```js 
const thread = channel.threads.cache.find(x => x.name === 'food-talk');
await thread.setLocked(true); // bloqueo
await thread.setLocked(false); // desbloqueo
```

::: warning ADVERTENCIA
¡Los hilos archivados no se pueden bloquear!
:::

## Hilos públicos y privados

Los hilos públicos son visibles para todos los que pueden ver el canal principal del hilo. Los hilos públicos deben crearse a partir de un mensaje existente, pero pueden quedar "huérfanos" si ese mensaje se elimina. El hilo creado y el mensaje desde el que se originó compartirán el mismo ID. El tipo de hilo creado coincide con el tipo del canal principal.

Los hilos privados se comportan de manera similar a los DM de grupo, pero en un servidor, los hilos privados solo se pueden crear en canales de texto.

Para crear un hilo privado, use `ThreadManager#create()` y pase `private_thread` como el `tipo`:

<!-- eslint-skip -->

```js {4}
const thread = await channel.threads.create({
	name: 'mod-talk',
	autoArchiveDuration: 60,
	type: 'private_thread',
	reason: 'Necesitaba un hilo separado para la moderación.',
});

console.log(`Hilo creado: ${thread.name}`);
```

## Agregar y eliminar miembros

Puedes agregar y eliminar miembros desde y hacia un canal de hilo.

Para agregar un miembro a un hilo, use el método `ThreadMemberManager#add()`:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find(x => x.name === 'food-talk');
await thread.members.add('140214425276776449');
```

Y para eliminar un miembro de un hilo, usa `ThreadMemberManager#remove()`:

<!-- eslint-skip -->

```js
const thread = channel.threads.cache.find(x => x.name === 'food-talk');
await thread.members.remove('140214425276776449');
```
¡Y eso es! ¡Ahora ya sabes todo lo que hay que saber sobre cómo trabajar con hilos usando discord.js!
