<template>
	<apexchart height=250 :options="options" :series="series"></apexchart>
</template>

<script>

export default{
	props: ['chartName', 'dateList', 'data', 'color'],

	data() {
		return {

		}
	},
	
	mounted() {

	},
	computed: {
		options () {
			return {
				colors:[this.color],
				chart: {
					id: this.chartName,
					type: 'line'
				},
				xaxis: {
					categories: this.dateList
				},
				stroke: {
					curve: 'smooth',
				}
			};
		},

		series () {
			return [{
				name: this.ChartName,
				data: this.data
			}];
		}
	}
}
</script>

<style scoped>

</style>