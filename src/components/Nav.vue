<template>
	<div class="px-20 py-5 lg:w-2/3">
		<div class="font-extrabold flow-root lg:text-4xl">
			R<sub>t</sub> Covid-19 India
		</div>
		These are average R<sub>t</sub> values compiled through the data collected daily. R<sub>t</sub>, also referred to as the reproduction number, denotes mathematical measure of a virus spread. R<sub>t</sub> tells you the average number of people who will contract a contagious disease from one person with that disease. This model was made with use of data from <a href="https://www.covid19india.org/">covid19india.org</a> and inspired by <a href="https://www.rt.live/">rt.live</a>.
		<br>
		Read more in the <a href="/faq">FAQs</a>
	</div>
</template>

<script>

export default{
	name: 'Nav',
};
</script>

<style scoped>
	a {
		color: red;
		text-decoration: underline red;
	}
</style>