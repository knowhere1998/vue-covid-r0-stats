<template lang="html">
	<aside>
		<div class="w-full flex-col lg:sticky lg:top-0">
			<div class="border bg-white lg:flex lg:flex-col shadow-xl my-2 mx-2 p-6">
				<p class="text-xl font-semibold pl-2 mb-5">About this site</p>
				<p class="mb-2">These stats do not represent exact values for reproduction number according to R<sub>t</sub> and keep changing daily as the model is implemented on time partitioned data using basic reproduction number method. It provides an insight to progression of the virus in India as of today, starting from the beginning of the pandemic.</p>
				<div class="links flex flex-col">
					<a class="link link-underlined cursor-pointer" @click="launchModal()">FAQs</a>
					<a class="link link-underlined" :href="getAPIURL()">Recompiled data API</a>
					<a class="link link-underlined" href="https://github.com/knowhere1998/vue-covid-rt-stats/">GitHub Repository</a>
				</div>
			</div>
			<div class="border bg-white lg:flex lg:flex-col shadow-xl my-2 mx-2 p-6">
				<p class="text-xl font-semibold pl-2 mx-auto mb-5">Site made by
					<a class="link" href="https://about.me/a3darekar">a3darekar</a>
				</p>
				<p class="mb-6 text-lg mx-auto">Get in touch!</p>
				<div class="links flex justify-center px-4">
					<a class="link link-underlined mx-8" href="mailto:darekar.amey@gmail.com"><img src="https://img.icons8.com/material-rounded/24/000000/important-mail.png"/></a>
					<a class="link link-underlined mx-8" href="https://twitter.com/a3darekar"><img src="https://img.icons8.com/android/24/000000/twitter.png"/></a>
					<a class="link link-underlined mx-8" href="https://github.com/knowhere1998/"><img src="https://img.icons8.com/material-outlined/24/000000/github.png"/></a>
					<a class="link link-underlined mx-8" href="https://linkedin.com/in/amey-darekar-47950b173/"><img src="https://img.icons8.com/android/24/000000/linkedin.png"/></a>
				</div>
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
	}

	.link-underlined {
		text-decoration: underline red;
	}
</style>
