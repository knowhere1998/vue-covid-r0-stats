<template>
	<apexchart :height="height" :options="options" :series="series"></apexchart>
</template>

<script>

export default{
	props: ['chartName', 'dateList', 'data', 'color', 'type', 'height', 'showLabels'],

	computed: {
		options () {
			return {
				colors:[this.color],
				chart: {
					id: this.chartName,
					type: this.type
				},
				title: {
					text: this.chartName,
				},
				xaxis: {
					categories: this.dateList,
					labels: {
						show: this.showLabels
					},
					tooltip: {
						enabled: true
					}
				},
				yaxis: {
					tooltip: {
						enabled: true
					}
				},
				annotations: {
					yaxis: [{
						y: 1,
						borderColor: '#00E396',
						label: {
							borderColor: '#00E396',
							style: {
								fontSize: '17px',
								color: '#fff',
								background: '#00E396'
							},
							orientation: 'horizontal',
							offsetX: 0,
							text: 'Annotation Test'
						}
					}]
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
				}]
			};
		},

		series () {
			return [{
				data: this.data,
			}];
		}
	}
}
</script>

<style scoped>

</style>