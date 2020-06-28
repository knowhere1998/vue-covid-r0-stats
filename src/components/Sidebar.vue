<template lang="html">
	<aside>
		<div class="w-full lg:flex lg:flex-col lg:sticky lg:top-0">
			<div class="border bg-white lg:flex lg:flex-col shadow-xl mt-4 p-6">
				<p class="text-xl font-semibold pl-2 pb-5">About this site</p>
				<p class="pb-2">As of today, these stats do not represent exact values for reproduction number according to R<sub>t</sub>, but provide an insight to progression of the virus in India till now, from the beginning of the pandemic.</p>
				<a class="link cursor-pointer" @click="launchModal()">FAQ</a>
				<a class="link" :href="getAPIURL()">Data API</a>
				<a class="link" href="https://github.com/knowhere1998/vue-covid-rt-stats/">GitHub Repository</a>
				<a class="link" href="https://twitter.com/Kn0wh3re">Twitter</a>
				<a class="link" href="https://linkedin.com/in/amey-darekar-47950b173/">LinkedIn</a>				
			</div>
		</div>
	</aside>
</template>

<script>
import CONSTANTS from './../constants.js';

export default  {
	name: 'Sidebar',
	props: [
		'modalStatus',
	],
	methods: {
		launchModal() {
			this.$emit('update:modalStatus', true);
		},
		getAPIURL() {
			return CONSTANTS.API_URL;
		}
	}
};
</script>

<style scoped>
	.link {
		color: red;
		text-decoration: underline red;
	}
</style>
