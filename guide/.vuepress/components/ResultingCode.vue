<template>
	<p>
		Si quieres comparar tu código con el código que hemos hecho durante el camino, puedes revisarlo en nuestro repositorio de GitHub
		<a :href="githubLink" target="_blank" rel="noopener noreferrer">
			aquí <OutboundLink />
		</a>.
	</p>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { usePageData } from '@vuepress/client';

const codeSamplesURL = 'https://github.com/Awoocado/guide/tree/main/code-samples/';

const paths = {
	'creating-your-bot/up-and-running': 'creando-tu-bot/en-marcha',
};
const props = defineProps({
	path: String,
});

const githubLink = ref(codeSamplesURL);
const page = usePageData();

onMounted(() => {
	console.log(page);
	githubLink.value += paths[props.path] || page?.value.path.slice(1).replace('.html', '');
	console.log(props);
	console.log(ref(codeSamplesURL));
	console.log(githubLink);
});
</script>
