export default {
	'/voice/': [
		{
			text: 'Inicio',
			children: [
				'/',
				'/requesting-more-content.md',
				'/whats-new.md',
			],
		},
		{
			text: '¿Cómo empezar?',
			children: [
				'/voice/',
			],
		},
		{
			text: 'Librería',
			children: [
				'/voice/life-cycles.md',
				'/voice/voice-connections.md',
				'/voice/audio-player.md',
				'/voice/audio-resources.md',
			],
		},
	],
	'/': [
		{
			text: 'Inicio',
			children: [
				'/',
				'/requesting-more-content.md',
				'/whats-new.md',
			],
		},
		{
			text: 'Preparándose',
			children: [
				'/preparaciones/',
				'/preparaciones/setting-up-a-linter.md',
				'/preparaciones/setting-up-a-bot-application.md',
				'/preparaciones/adding-your-bot-to-servers.md',
			],
		},
		{
			text: 'Creando tu bot',
			children: [
				'/creando-tu-bot/',
				'/creando-tu-bot/archivos-de-configuracion.md',
				'/creando-tu-bot/agregando-mas-comandos.md',
			],
		},
		{
			text: 'Administrador de comandos',
			children: [
				'/gestor-de-comandos/',
			],
		},
		{
			text: 'Administrador de eventos',
			children: [
				'/gestor-de-eventos/',
			],
		},
		{
			text: 'Interacciones',
			children: [
				'/interacciones/registrando-comandos-de-barra.md',
				'/interacciones/respondiendo-a-comandos-de-barra.md',
				'/interacciones/permisos-de-comandos-de-barra.md',
				'/interacciones/botones.md',
				'/interacciones/select-menus.md',
			],
		},
		{
			text: 'Temas populares',
			children: [
				'/temas-populares/faq.md',
				'/temas-populares/threads.md',
				'/temas-populares/embeds.md',
				'/temas-populares/builders.md',
				'/temas-populares/reactions.md',
				'/temas-populares/collectors.md',
				'/temas-populares/permissions.md',
				'/temas-populares/permissions-extended.md',
				'/temas-populares/intents.md',
				'/temas-populares/partials.md',
				'/temas-populares/webhooks.md',
				'/temas-populares/errors.md',
				'/temas-populares/audit-logs.md',
				'/temas-populares/canvas.md',
			],
		},
		{
			text: 'Misceláneo',
			children: [
				'/miscelaneo/analizar-argumentos-de-mencion.md',
				'/miscelaneo/paquetes-utiles.md',
			],
		},
		{
			text: 'Bases de datos',
			children: [
				'/sequelize/',
				'/sequelize/currency.md',
				'/keyv/',
			],
		},
		{
			text: 'Fragmentación (Sharding)',
			children: [
				'/sharding/',
				'/sharding/additional-information.md',
				'/sharding/extended.md',
			],
		},
		{
			text: 'OAuth2',
			children: [
				'/oauth2/',
			],
		},
		{
			text: 'Mejorando tu entorno de desarrollo',
			children: [
				'/mejorando-el entorno-de-desarrollo/pm2.md',
				'/mejorando-el entorno-de-desarrollo/package-json-scripts.md',
			],
		},
		{
			text: 'Información adicional',
			children: [
				'/informacion-adicional/notacion.md',
				'/informacion-adicional/sintaxis-es6.md',
				'/informacion-adicional/colecciones.md',
				'/informacion-adicional/async-await.md',
				'/informacion-adicional/rest-api.md',
				'/informacion-adicional/cambios-en-v13.md',
			],
		},
	],
};
