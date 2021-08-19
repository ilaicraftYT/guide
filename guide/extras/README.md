# Message Content Intent

Discord anunció que el contenido de los mensajes serán parte de un intent privilegiado. **Esto no afecta a los bots privados.**
El contenido de los mensajes es considerado información sensible asi que la gran mayoría de bots públicos tendrán que pasar a comandos de barra para poder cumplir con las nuevas restricciones.

El intent de Message Content te permitirá conseguir toda la información relevante de un mensaje.
Las interacciones ofrecidas por Discord (comandos de barra, menú contextual y componentes para los mensajes) ya cubren la mayoría de requisitos para que un bot funcione sin la necesidad del próximo intent privilegiado.

Usted puede pedir el nuevo intent si y solo si no puede replicar alguna función de su bot usando solo interacciones (componentes, comandos de barra, menú contextual)

## ¿Qué pasará con mi bot si no obtengo el intent?
Si inicias tu bot sin el intent, o si tu solicitud es rechazada, tu bot no recibirá *pero si podrá enviar* las siguientes propiedades de los mensajes:
- `content`
- `embeds`
- `attachments`
- `components`

Incluso si no consigues el intent, el bot recibirá esas propiedades si el mensaje:
* Fue enviado al MD del bot
* Contiene una mención al bot
* Es del propio bot

## Bots Privados 
||Actualidad|Semanas antes de abril de 2022 (Message Content Intent se puede solicitar)|A partir de abril del 2022 (Message Content Intent es privilegiado)|
|:-:|:-:|:-:|:-:|
|Bot Privado en v12|Posiblemente uses el gestor de comandos basado en mensajes, no hay necesidad de actualizar si no necesitas ninguna función nueva (componentes, comandos de barra y menú contextual)|Nada deberia cambiar, los intents privilegiados puedes activarlos desde la dashboard de Discord o por último, no usar intents|<--|
|Bot Privado en v13|¡Genial! Ya puedes usar todas las funciones nuevas que Discord ofrece|Nada deberia cambiar, los intents privilegiados puedes activarlos desde la dashboard de Discord|<--|


## Bots Públicos
||Actualidad|Semanas antes de abril de 2022 (Message Content Intent se puede solicitar)|A partir de abril del 2022 (Message Content Intent es privilegiado)|
|:-:|:-:|:-:|:-:|
|Bot público genérico en v12|Tu bot va a tener que usar comandos de barra a partir de abril, considera pasar todos tus comandos a comandos de barra pronto (actualizar a v13)|Tu bot va a tener que usar comandos de barra a partir de abril, considera pasar todos tus comandos a comandos de barra pronto (actualizar a v13)|Tu bot ahora solo debe usar comandos de barra|
|Bot público genérico en v13|Tu bot va a tener que usar comandos de barra a partir de abril, considera pasar todos tus comandos a comandos de barra pronto|Tu bot va a tener que usar comandos de barra a partir de abril, considera pasar todos tus comandos a comandos de barra pronto|Tu bot ahora solo debe usar comandos de barra|
|Bot público que tiene sistema de moderación automática en v12|Nada impide que el bot use un prefijo personalizado, puedes seguir usando el mismo handler. Actualizar a v13 sería opcional si no necesitas moderar hilos o usar interaciones (componentes, comandos de barra y menú contextual)|<--|<--|
|Bot público que tiene sistema de moderación automática en v13|Nada impide que el bot use un prefijo personalizado, puedes seguir usando el mismo handler|<--|<--|

## ¿Cómo saber qué tipo de bot tengo?
Por la cantidad de servidores:
- Privado: Tu bot ha sido diseñado para un solo server, no lo vas a verificar o es de pruebas (menos de 100 servidores)
- Público: Tu bot ha sido diseñado para múltiples servidores, planeas verificarlo o ya está verificado

Por las funciones que ofrece:
- Moderación Automática: Tu bot tiene filtros automáticos para los mensajes (anti-links, anti-invites, malas palabras, etc.)
- Genérico: Tu bot tiene cualquier otro tipo de comando (informativos, roleplay, utilidad, diversión, sorteos, bienvenidas y niveles)

## Preguntas Frecuentes para bots públicos
### ¿Porqué los sistemas de niveles/experiencia no cuentan para conseguir el Intent de Message Content?
Si bien es cierto que necesitas ver los mensajes para otorgar experiencia al miembro por su actividad, no necesitas el contenido del mismo. Los sistemas de niveles no cuentan como motivo para pedir el intent privilegiado.

### No me gustan los comandos de barra, voy a pedir el Message Content Intent de todos modos :P
Al igual que los otros intents privilegiados (Guild Presences y Guild Members), vas a tener que explicar a Discord que planeas hacer con los mensajes. 

### Espera, ¿Eso significa que ya no van a existir los prefijos personalizados?
Asi es, el hecho de que no puedas ver el contenido del mensaje significa que no vas a poder analizarlo para ver el prefix. De cierta manera estás obligado a usar comandos de barra.

Como alternativa puedes usar las menciones como prefix (los bots reciben todas las propiedades de un mensaje si son mencionados)

### Mi bot es de moderación, ¿De todos modos tengo que pasar mis comandos a comandos de barra o puedo seguir usando mi prefijo personalizado?
Tal parece que Discord no evita que los bots de moderación (los únicos bots que pueden conseguir este intent) usen un prefijo personalizado. Actualizar a comandos de barra puede que no sea necesario pero tampoco tengo la menor idea 
