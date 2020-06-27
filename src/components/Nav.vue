<template>
	<div class="pl-8 pt-8 lg:w-3/4">
		<div class="font-extrabold flow-root pb-4 text-3xl lg:text-4xl">
			<a href="/">
				R<sub>t</sub> Covid-19 India
			</a>
		</div>
		These are average R<sub>t</sub> values compiled through the data collected daily. R<sub>t</sub>, also referred to as the reproduction number, denotes mathematical measure of a virus spread. R<sub>t</sub> tells you the average number of people who will contract a contagious disease from one person with that disease. This model was made with use of data from <a class="link"  href="https://www.covid19india.org/">covid19india.org</a> and inspired by <a class="link" href="https://www.rt.live/">rt.live</a>.
		<br>
		Please check out the FAQs to <a class="link cursor-pointer" @click="launchModal()">Learn more.</a>

		<div class="flex justify-end" v-if="lastUpdated">
			<div class="bg-red-600 text-white font-bold text-sm border-white rounded p-1 mr-5">
				Last updated at: {{ lastUpdated }}</div>
			</div>
	</div>
</template>

<script>

export default{
	name: 'Nav',
	props: [
		'modalStatus',
		'lastUpdated'
	],
	methods: {
		launchModal() {
			this.$emit('update:modalStatus', true);
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