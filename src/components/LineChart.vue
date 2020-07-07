<template>
	<apexchart :height="height" :options="options" :series="series"></apexchart>
</template>

<script>

export default{
	props: ['chartName', 'dateList', 'data', 'color', 'type', 'height', 'showLabels', 'annotations'],

	computed: {
		options () {
			return {
				colors:[this.color],
				chart: {
					id: this.chartName,
					type: this.type,
					toolbar: {
						show: false
					}
				},
				xaxis: {
					categories: this.dateList,
					labels: {
						show: this.showLabels
					}
				},
				responsive: [{
					breakpoint: 1000,
					options: {
						plotOptions: {
							bar: {
								horizontal: false
							}
						},
						legend: {
							position: "bottom"
						}
					},
				}],
				stroke: {
					curve: 'smooth',
				}
			};
		},

		series () {
			return [{
				name: this.chartName,
				data: this.data
			}];
		}
	}
};
</script>

<style scoped>

</style>