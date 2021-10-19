# Colecciones

Discord.js viene con una clase de utilidad conocida como `Collection`.
Extiende la clase nativa de JavaScript `Map`, así que tiene todas las funciones de `Map` y muchas más.

::: warning ADVERTENCIA
Si no estás familiarizado con `Map`, lee la [documentación de MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) antes de continuar. Deberías estar familiarizado con los métodos de un [`Array`](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array) de igual forma. También usaremos algunas funciones de ES6, así que lee [aquí](/informacion-adicional/sintaxis-ES6.md) si no sabes qué es.
:::

Un `Map` te permite hacer una asociación entre llaves únicas y sus valores.
Por ejemplo, ¿Cómo podrías transformar cada valor o filtrar las entradas en un `Map` fácilmente?
¡Ese es el punto de la clase `Collection`!

## Métodos de matrices (Array)

Muchos de los métodos de `Collection` corresponden a su homónimo en `Array`. Uno de ellos es `find`:

```js
// Asumiendo que tenemos una matriz de usuarios y una colección con los mismos usuarios.
array.find(u => u.discriminator === '1000');
collection.find(u => u.discriminator === '1000');
```

La interfaz de la función callback es bastante similar entre los dos.
Para las matrices, los callbacks usualmente pasan los parámetros `(value, index, array)`, donde `value` es el valor iterado, `index` es el índice actual y `array` es la matriz. Para las colecciones, tendrías `(value, key, collection)`. Aquí, `value` es el mismo, pero `key` es la llave del valor, y `collection` es la colección.

Los métodos que siguen esta filosofía de parecerse a la interfaz `Array` son los siguientes:

- `find`
- `filter` - Esto retorna una `Collection` en vez de un `Array`.
- `map` - Sin embargo, esto devuelve un `Array` de valores en lugar de una `Collection`.
- `every`
- `some`
- `reduce`
- `concat`
- `sort`

## Convirtiendo a matriz (Array)

Ya que `Collection` extiende a `Map`, es [iterable](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Iteration_protocols), y puede ser convertido a un Array ya sea con `Array.from()` o esparciéndolo (`...collection`).

```js
// Por valores
Array.from(collection.values());
[...collection.values()];

// Por llaves
Array.from(collection.keys());
[...collection.keys()];

// Por pares de [llave, valor]
Array.from(collection);
[...collection];
```

::: warning ADVERTENCIA
¡Mucha gente convierte `Collection`s a `Array`s demasiado! Esto puede llevar a código innecesario y confuso. Antes de que uses `Array.from()` o similar, pregúntate a ti mismo si lo que estás haciendo no puede ser hecho con los métodos dados de `Map` o `Collection`, o con un búcle for-of.
:::

## Utilidades extra

Algunos métodos no provienen de `Array` y, en cambio, son completamente nuevos en el JavaScript estándar.

```js
// Un valor aleatorio
collection.random();

// El primer valor
collection.first();

// Los primeros 5 valores
collection.first(5);

// Similar a 'first', pero desde el final
collection.last();
collection.last(2);

// Elimina de la colección todo lo que cumpla con la condición.
collection.sweep(user => user.username === 'Bob');
```

Un método más complicado es `partition`, que separa una sola `Collection` en dos nuevas `Collection`s basadas en la función dada.
Puedes pensar en ello como dos `filtros`, pero hechos al mismo tiempo:


```js
// 'bots' es una Collection de usuarios donde su propiedad  'bot' devuelve true.
// 'humans' es una Collection de usuarios donde su propiedad 'bot' devuelve false.
const [bots, humans] = collection.partition(u => u.bot);

// Ambos devuelven true
bots.every(b => b.bot);
humans.every(h => !h.bot);
```
