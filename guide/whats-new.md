<style scoped>
.emoji-container {
	display: inline-block;
}

.emoji-container .emoji-image {
	width: 1.375rem;
	height: 1.375rem;
	vertical-align: bottom;
}
</style>

# ¿Qué hay de nuevo?

<DiscordMessages>
	<DiscordMessage profile="bot">
		<template #interactions>
			<DiscordInteraction
				profile="user"
				author="discord.js"
				:command="true"
			>upgrade</DiscordInteraction>
		</template>
		Discord.js v13 ya está disponible, pero esta guía sigue en proceso.
		<span class="emoji-container">
			<img class="emoji-image" title="weary" src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f629.png" alt=""/>
		</span>
		<br/>
		Esta guía incluye material acerca de los slash commands y componentes.
	</DiscordMessage>
</DiscordMessages>

::: warning
La traducción de la guía está en proceso, por lo que aún existe texto en inglés. Ayúdanos con un pull request en nuestro [repositorio](https://github.com/Awoocado/guide)
:::

## Temas

- Seguimos traduciendo la guía.

## Páginas

Todo el contenido de la guia usa discord.js v13. La versión anterior de esta guía se puede encontrar en [https://v12.discordjs.guide/](https://v12.discordjs.guide/) (en inglés).

### Contenido

- [Actualizando de v12 a v13](/additional-info/changes-in-v13.md): Una lista de cambios para actualizar de discord.js v12 a v13
- [Registrando slash commands](/interactions/registering-slash-commands.md): Pasos para registrar slash commands
- [Respondiendo a slash commands](/interactions/replying-to-slash-commands.md): Múltiples maneras de responder un slash command
- [Permisos para slash command](/interactions/slash-command-permissions.md): Restringir slash commands por usuario o por rol
- [Botones](/interactions/buttons.md): Definiendo, enviando y recibiendo botones
- [Menús de selección](/interactions/select-menus.md): Definiendo, enviando y recibiendo menús de selección
- [Hilos](/popular-topics/threads.md): Creando y manejando hilos

### Nuevo

- Commando: Será reemplazado por una guía de [Sapphire](https://github.com/discordjs/guide/pull/711). *Aunque siendo sinceros, es mejor usar el handler de esta guía.*
- [Voz](/voice/): Reescrito para que use [`@discordjs/voice`](https://github.com/discordjs/voice).
- [Administrador de comandos](/command-handling/): Actualizado a slash commands
	- Secciones obsoletas removidas
- `client.on('message')` códigos actualizados a `client.on('interactionCreate')`
	- ["Guild Message Content" será un intent privilegiado en Abril del 2022](https://support-dev.discord.com/hc/es-es/articles/4404772028055)

<DiscordMessages>
	<DiscordMessage profile="bot">
		Gracias a todos los que han ayudado en el desarrollo y traducción de esta guía.
		<br/>
		¡A crear un bot!
		<span class="emoji-container">
			<img class="emoji-image" title="heart" src="https://twemoji.maxcdn.com/v/13.1.0/72x72/2764.png" alt="" />
		</span>
		<span class="emoji-container">
			<img class="emoji-image" title="jigglel" src="https://cdn.discordapp.com/emojis/737199683906306088.gif" alt="" />
		</span>
	</DiscordMessage>
</DiscordMessages>
