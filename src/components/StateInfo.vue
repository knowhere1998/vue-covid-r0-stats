<template>
	<div class="state-info border-4 bg-white rounded-lg lg:px-4 px-2 border-gray-200 shadow-lg justify-center">
		<div class="lg:flex justify-around py-4">
			<h3 class="w-1/3 md:text-xl px-4 pt-4 font-bold text-xl lg:font-extrabold lg:text-5xl align-middle">{{ state }}</h3>
			<div class="lg:flex w-2/3 align-middle justify-end">
				<div class="inline-block lg:px-5 px-3 lg:py-10 py-2">
					<div class="flow-root lg:text-xl sm:text-sm lg:text-center lg:font-bold text-red-800">
						Confirmed: {{ confirmedData | state(state) | last | accumulated }} ({{ confirmedData | state(state) | last | delta | getNumber }})
					</div>
				</div>
				<div class="inline-block lg:px-5 px-3 lg:py-10 py-2">
					<div class="flow-root lg:text-xl sm:text-sm lg:text-center lg:font-bold text-blue-800">
						Active: {{ activeData | state(state) | last | accumulated }} ({{ activeData | state(state) | last | delta | getNumber }})
					</div>
				</div>
				<div class="inline-block lg:px-5 px-3 lg:py-10 py-2">
					<div class="flow-root lg:text-xl sm:text-sm lg:text-center lg:font-bold text-green-800">
						Recovered: {{ recoveredData | state(state) | last | accumulated }} ({{ recoveredData | state(state) | last | delta | getNumber }})
					</div>
				</div>
			</div>
		</div>
		<div class="lg:flex">
			<div class="lg:w-1/2 lg:pt-6 md:pt-4 mt-2 lg:ml-5 rounded-l-lg overflow-hidden shadow-inner justify-center">
				<div class="flow-root text-center lg:font-bold text-red-800">Confirmed Cases</div>
					<LineChart height=200 showLabels=true chartName="Confirmed Cases" :type= "getType()" :dateList="dateList" color="#ff0000" :data="getMapData(confirmedData)" />
				<div class="flow-root text-center lg:font-bold text-blue-800">Active Cases</div>
					<LineChart height=200 showLabels=true chartName="Active Cases" :type= "getType()" :dateList="dateList" color="#0000ff" :data="getMapData(activeData)" />
				<div class="flow-root text-center lg:font-bold text-green-800">Recovered Cases</div>
					<LineChart height=200 showLabels=true chartName="Recovered Cases" :type= "getType()" :dateList="dateList" color="#00ff00" :data="getMapData(recoveredData)" />
			</div>
			<div class="lg:w-1/2 lg:pt-6 md:pt-4 mt-2 lg:mr-5 rounded-r-lg overflow-hidden shadow-inner justify-center">
				<div class="container h-full items-end">
					<div class="lg:text-4xl font-extrabold lg:text-center lg:p-16 p-8">
						<div class="lg:pb-5 pb-2">
							Current R<sub>t</sub> &nbsp;&nbsp;&nbsp;&nbsp; {{ rNought(state) | toFixed(3) }}
						</div>
						<div class="text-sm">(for last 15 days)</div>
					</div>
					<div class="sm:px-2">
						<div class="flow-root lg:text-2xl text-center lg:font-bold text-blue-800">Rt-Trend</div>
						<LineChart height=400 chartName="Rt-map" :dateList="getDates" color="#0000ff" :data="getRtData(activeData)" />
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
	
	props: ['state', 'dates', 'dateList', 'confirmedData', 'activeData', 'recoveredData', 'dateRange', 'dataToggle', "rangeToggle"],

	computed: {
		getDates () {
			return this.dates.map(value=> {return moment(value).format('DD-MMM-YY')});
		},

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

		getRtData(data) {
			data = data.filter(record=>{
				return record['state'] === this.state;
			}).map(record => {
				return (record['rt']) ? record['rt'].toFixed(2): 0;
			});
			return data;
		},

		rNought(state) {
			return this.activeData.filter(record=> {
				return record['state'] === state;
			}).map(record => {
				return record['rt'];
			}).slice(-1)[0];
		},

		getType() {
			if (this.dataToggle) {
				return "line"
			}else {
				return "bar"
			}
		},
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
			if (value){
				return value.toFixed(limit);
			}else{
				return 0;
			}
		},

		accumulated(value) {
			return value['accumulated']
		},

		delta(value) {
			return value['delta']
		},

		getNumber(value) {
			if (value > 0) {
				return "+" + value;
			} else {
				return value.toString();
			}
		}
	},
};


</script>

<style scoped>
	.state-info {

	}
</style>
