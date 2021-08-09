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
		discord.js v13 ya está disponible pero esta guía sigue en proceso
		<span class="emoji-container">
			<img class="emoji-image" title="tada" src="https://twemoji.maxcdn.com/v/13.1.0/72x72/1f629.png" alt="" />
		</span>
		<br />
		Esta guía incluye material acerca de los slash commands y componentes.
	</DiscordMessage>
</DiscordMessages>

## Site

- Actualizado a [VuePress v2](https://v2.vuepress.vuejs.org/)
- Nuevo tema que se iguala a [la documentación de discord.js](https://discord.js.org/)
- El compenente de mensajes de Discord ahora es [@discord-message-components/vue](https://github.com/Danktuary/discord-message-components/blob/main/packages/vue/README.md)
- ~~Many fixes in codeblocks, grammar, consistency, etc~~ Seguimos traduciendo la guía

## Pages

Todo el contenido de la guia usa discord.js v13. La versión de esta guia se puede encontrar en [https://v12.discordjs.guide/](https://v12.discordjs.guide/) (en inglés).

### New

- [Actualizando de v12 a v13](/additional-info/changes-in-v13.md): Una lista de cambios para actualizar de discord.js v12 a v13
- [Registrando slash commands](/interactions/registering-slash-commands.md): Pasos para registrar slash commands
- [Responiendo a slash commands](/interactions/replying-to-slash-commands.md): Multiples maneras de responder un slash command
- [Permisos para slash command](/interactions/slash-command-permissions.md): Restringir slash commands por usuario o por rol
- [Botones!](/interactions/buttons.md): Definiendo, enviando y recibiendo botones
- [Select menus](/interactions/select-menus.md): Definiendo, enviando y recibiendo select menus
- [Threads](/popular-topics/threads.md): Creando y manejando threads

### Updated

- Commando: Reemplazado por una guia de [Sapphire](https://github.com/discordjs/guide/pull/711) ~~Aunque para ser sincero es mejor crear el handler como en la guia~~
- [Voice](/voice/): Reescrito para que use [`@discordjs/voice`](https://github.com/discordjs/voice) 
- [Administrador de comandos](/command-handling/): Actualizado a slash commands
	- Secciones obsoletas removidas
- `client.on('message')` snippets actualizados a `client.on('interactionCreate')`
	- ['Message Content' será un intent privilegiado en Abril del 2022](https://support-dev.discord.com/hc/es-es/articles/4404772028055)

<DiscordMessages>
	<DiscordMessage profile="bot">
		Gracias a todos los que han ayudado en el desarrollo de discord.js y de la guía
		<br />
		¡A crear un bot!
		<span class="emoji-container">
			<img class="emoji-image" title="heart" src="https://twemoji.maxcdn.com/v/13.1.0/72x72/2764.png" alt="" />
		</span>
	</DiscordMessage>
</DiscordMessages>
