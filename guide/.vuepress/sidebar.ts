export default {
	'/extras/': [
		{
			text: 'Nuevo',
			children: [
				'/extras/',
			],
		},
	],
	'/voz/': [
		{
			text: 'Inicio',
			children: [
				'/',
				'/solicitando-mas-contenido.md',
				'/que-hay-de-nuevo.md',
			],
		},
		{
			text: '¿Cómo empezar?',
			children: [
				'/voz/',
			],
		},
		{
			text: 'Librería',
			children: [
				'/voz/ciclos-de-vida.md',
				'/voz/conexiones-de-voz.md',
				'/voz/reproductor-de-audio.md',
				'/voz/recursos-de-audio.md',
			],
		},
	],
	'/': [
		{
			text: 'Inicio',
			children: [
				'/',
				'/solicitando-mas-contenido.md',
				'/que-hay-de-nuevo.md',
			],
		},
		{
			text: 'Preparándose',
			children: [
				'/preparaciones/',
				'/preparaciones/configurando-un-linter.md',
				'/preparaciones/configurando-una-app-bot.md',
				'/preparaciones/agregando-tu-bot-a-servidores.md',
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
				'/temas-populares/hilos.md',
				'/temas-populares/embeds.md',
				'/temas-populares/constructores.md',
				'/temas-populares/reacciones.md',
				'/temas-populares/colecciones.md',
				'/temas-populares/permisos.md',
				'/temas-populares/permisos-extendidos.md',
				'/temas-populares/intents.md',
				'/temas-populares/parciales.md',
				'/temas-populares/webhooks.md',
				'/temas-populares/errores.md',
				'/temas-populares/registro-de-auditoria.md',
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
				'/sequelize/economia.md',
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
