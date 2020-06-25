<template lang="html">
	<aside class="footer my-5 w-full lg:flex shadow-2xl lg:flex-col items-center p-4">
		<div class="w-full bg-white lg:flex lg:flex-col my-4 p-6">
			<p class="text-xl font-semibold pb-5">About this site</p>
			<p class="pb-2">As of today, these stats do not represent exact values for reproduction number according to R<sub>t</sub>, but provide an insight to progression of the virus in India till now, from the beginning of the pandemic.</p>
<!--                 <a href="#" class="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 lg:flex items-center justify-center px-2 py-3 mt-4">
				Get to know us
			</a>-->

			<a href="/faq">FAQ</a>
			<a href="https://github.com/knowhere1998/">GitHub</a>
			<a href="https://twitter.com/Kn0wh3re">twitter</a>
			<a href="/faq">LinkedIn</a>
		</div>
	</aside>
</template>

<script>
export default  {
	name: 'Sidebar',
	props: [],
	mounted () {

	},
	data () {
		return {

		}
	},
};
</script>

<style scoped>
	a {
		color: red;
		text-decoration: underline red;
	}
</style>
