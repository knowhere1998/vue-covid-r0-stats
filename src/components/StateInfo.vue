<template>
	<div class="state-info border-4 rounded-lg p-4 border-gray-200 shadow-lg justify-center">
		<h3 class="h-14 w-full text-center text-5xl">{{ state }}</h3>
		<div class="flex">
			<div class="w-2/3 p-6 m-2 ml-5 rounded-l-lg overflow-hidden border-2 border-gray-400 shadow-inner justify-center bg-gray-200">
				<div class="flow-root text-center font-bold text-red-800">Confirmed Cases</div>
					<LineChart chartName="Confirmed Cases" :dateList="dateList" color="#ff0000" :data="getMapData(confirmedData)" />
				<div class="flow-root text-center font-bold text-blue-800">Active Cases</div>
					<LineChart chartName="Active Cases" :dateList="dateList" color="#0000ff" :data="getMapData(activeData)" />
				<div class="flow-root text-center font-bold text-green-800">Recovered Cases</div>
					<LineChart chartName="Recovered Cases" :dateList="dateList" color="#00ff00" :data="getMapData(recoveredData)" />
			</div>
			<div class="w-1/3 p-6 m-2 max-w-md rounded-r-lg overflow-hidden border-2 border-gray-400 shadow-inner justify-center bg-gray-200">
				<div class="container h-full items-end">
					<div class="text-4xl text-center p-16">
						<div class="font-extrabold flow-root text-center">
							Current R<sub>0</sub>
						</div>
						<div class="font-extrabold flow-root text-center">
							{{ rNought(state) | toFixed(3) }}
						</div>
						<div v-if="rangeToggle" class="text-sm">(for last 30 days)</div>
						<div v-else  class="text-sm">(for last 15 days)</div>
					</div>
					<div class="p-8">
						<div class="flow-root text-2xl text-center font-bold text-red-800">
							Total: {{ confirmedData | state(state) | last | accumulated }}
						</div>
						<div class="flow-root text-xl text-center font-bold text-red-800">
							Latest delta: {{ confirmedData | state(state) | last | delta }}
						</div>
						<div class="flow-root pt-2 text-2xl text-center font-bold text-red-800">
							Confirmed
						</div>
					</div>
					<div class="p-8">
						<div class="flow-root text-2xl text-center font-bold text-blue-800">
							Total: {{ activeData    | state(state) | last | accumulated }}
						</div>
						<div class="flow-root text-xl text-center font-bold text-blue-800">
							Latest delta: {{ activeData    | state(state) | last | delta }}
						</div>
						<div class="flow-root pt-2 text-2xl text-center font-bold text-blue-800">
							Active
						</div>
					</div>
					<div class="p-8">
						<div class="flow-root text-2xl text-center font-bold text-green-800">
							Total: {{ recoveredData | state(state) | last | accumulated }}
						</div>
						<div class="flow-root text-xl text-center font-bold text-green-800">
							Latest delta: {{ recoveredData | state(state) | last | delta }}
						</div>
						<div class="flow-root pt-2 text-2xl text-center font-bold text-green-800">
							Recovered
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="js">
import LineChart from './LineChart.vue';
import moment from 'moment';

export default  {
	name: 'state-info',

	components:{
		LineChart,
	},
	
	props: ['state', 'dateList', 'confirmedData', 'activeData', 'recoveredData', 'dateRange', 'dataToggle', "rangeToggle"],

	mounted () {

	},

	data () {
		return {
			
		}
	},

	methods: {
		getMapData(data) {
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
