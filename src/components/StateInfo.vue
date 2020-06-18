<template>

	<section class="state-info">
		<h3 class="h-12 w-full text-center text-2xl">{{ state }}</h3>
		<div class="flex">
					<div class="w-2/3 p-6">
						<h4>Confirmed Cases</h4>
							<LineChart chartName="Confirmed Cases" :dateList="dateList" color="#ff0000" :data="getMapData(confirmedData)" />
						<h4>Active Cases</h4>
							<LineChart chartName="Confirmed Cases" :dateList="dateList" color="#0000ff" :data="getMapData(activeData)" />
						<h4>Recovered Cases</h4>
							<LineChart chartName="Confirmed Cases" :dateList="dateList" color="#00ff00" :data="getMapData(recoveredData)" />
					</div>
					<div class="w-1/3 bg-green-100 p-6">
						<div class="text-2xl p-16"> Current R<sub>0</sub>: {{ rNought(state) | toFixed(3) }}</div>
						<div v-if="dataToggle">
							{{ activeData | state(state) | last | accumulated }}
						</div>
						<div v-else>
							{{ activeData | state(state) | last | delta }}
						</div>
					</div>
				</div>
	</section>

</template>

<script lang="js">
import LineChart from './LineChart.vue';
import moment from 'moment';

export default  {
	name: 'state-info',

	components:{
		LineChart,
	},
	
	props: ['state', 'selectedState', 'dateList', 'confirmedData', 'activeData', 'recoveredData', 'dateRange', 'dataToggle'],

	mounted () {

	},

	data () {
		return {
			
		}
	},

	methods: {
		getMapData(data, ) {
			data = data.filter(record=>{
				return record['state'] === this.state && record['date'] >= this.dateRange[0] && record['date'] <= this.dateRange[1];
			}).map(record => {
				if (this.dataToggle) {
					return record['accumulated'];
				} else {
					return record['delta'];
				}
			});
			return data;
		},

		rNought(state) {

			let numerator = this.activeData.filter(record=> {
				return record['state'] === state && record['date'] === this.dateRange[1];
			}).map(record => {
				return record['accumulated'];
			});
			let denominator = this.activeData.filter(record=> {
				return record['state'] === state && record['date'] === this.dateRange[0];
			}).map(record => {
				return record['accumulated'];
			});
			return parseFloat(numerator/denominator);
		},
	},

	computed: {

	},

	filters: {
		toDate(value){
			return moment(String(value)).format("DD/MM/YYYY");
		},

		state(data, stateName) {
			if (data){
				return data.filter(entry=> {return entry.state === stateName});
			}
			return null;
		},

		last(data) {
			return data.splice(-1)[0];
		},

		first(data) {
			return data[0];
		},

		toFixed(value, limit){
			return value.toFixed(limit);
		},

		accumulated(value) {
			return value['accumulated']
		},

		delta(value) {
			return value['delta']
		},
	},
};


</script>

<style scoped>
	.state-info {

	}
</style>
