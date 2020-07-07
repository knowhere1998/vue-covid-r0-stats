<template>
	<div class="pl-8 pt-8 lg:w-3/4">
		<div class="font-extrabold flow-root text-3xl lg:text-4xl">
			<a href="/">
				R<sub>t</sub> Covid-19 India
			</a>
		</div>
		<div class="info-text px-4">
			R<sub>t</sub> is a mathematical term that determines how contagious a particular disease is. Here, R<sub>t</sub> denotes the average number of people one person with the Coronavirus infects. It is also referred to as the reproduction number which gives us an insight into the coronavirus spread across India. The R<sub>t</sub> values displayed on the screen are average values calculated from the data collected daily. 
			<br>
			This model was made with use of data from <a class="link" href="https://www.covid19india.org/">covid19india.org</a> and inspired by <a class="link" href="https://www.rt.live/">rt.live</a>.
			Please check out the FAQs to <a class="link cursor-pointer" @click="launchModal()">Learn more.</a>
		</div>
		<div class="flex justify-end my-4" v-if="lastUpdated">
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