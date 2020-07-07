<template>
	<div class="state-info bg-white lg:px-4 px-2 rounded-lg shadow-2xl justify-center">
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
			<div class="lg:w-1/2 lg:pt-6 md:pt-4 mt-2 lg:ml-5 rounded-l-lg overflow-hidden justify-center">
				<div class="flow-root text-center lg:font-bold text-red-800">Confirmed Cases</div>
					<LineChart height=200 showLabels=true chartName="Confirmed Cases" :type= "getType()" :dateList="dateList" color="#ff0000" :data="getMapData(confirmedData)" />
				<div class="flow-root text-center lg:font-bold text-blue-800">Active Cases</div>
					<LineChart height=200 showLabels=true chartName="Active Cases" :type= "getType()" :dateList="dateList" color="#0000ff" :data="getMapData(activeData)" />
				<div class="flow-root text-center lg:font-bold text-green-800">Recovered Cases</div>
					<LineChart height=200 showLabels=true chartName="Recovered Cases" :type= "getType()" :dateList="dateList" color="#00ff00" :data="getMapData(recoveredData)" />
			</div>
			<div class="lg:w-1/2 lg:pt-6 md:pt-4 mt-2 lg:mr-5 rounded-r-lg overflow-hidden justify-center">
				<div class="container h-full items-end">
					<div class="font-extrabold lg:text-center lg:p-12 p-8">
						<div class="lg:text-4xl">
							Current R<sub>t</sub> &nbsp;&nbsp;&nbsp;&nbsp; {{ getRtData | last }}
						</div>
						<div class="text-sm">
							(based on last 15 days)
						</div>
					</div>
					<div class="sm:px-2 flex-row">
						<div class="flow-root lg:text-2xl text-center lg:font-bold text-blue-800">Rt-Trend</div>
						<div class="flow-root text-center lg:font-bold text-blue-800 lg:text-sm">(From beginning of Lockdown Phase 2)</div>
						<LineChart height=400 type="line" chartName="Rt-map(from Lockdown Phase 2)" :dateList="rtDates" color="#0000ff" :data="getRtData" showlabels=true />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="js">
import LineChart from './LineChart.vue';
import moment from 'moment';
import _ from 'lodash';
import CONSTANTS from './../constants.js';

export default  {
	name: 'state-info',

	components:{
		LineChart,
	},
	
	props: ['state', 'dates', 'dateList', 'confirmedData', 'activeData', 'recoveredData', 'rtData', 'dateRange', 'dataToggle', "rangeToggle"],

	computed: {
		getDates () {
			return this.dates.map(value=> {return moment(value).format('DD-MMM-YY')});
		},

		rtDates() {
			return this.dates.filter(date=> {
				return moment(date) >= moment("15-Apr-20");
			}).map(value=> {
				return moment(value).format('DD-MMM');
			});
		},

		getRtData() {
			let data = this.rtData.filter(record=>{
				return record['state'] === this.state && moment(record['date']) > moment("15-Apr-20");
			}).map(record => {
				return (record['rt']) ? Math.abs(record['rt']) : 0;
			});
			return this.movingAverage(data);
		},

	},

	data () {
		return {
			timeline : CONSTANTS.timeline
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

		movingAverage(data) {
			return _.chain(data)
					.map(this.window)
					.map(this.average)
					.value();
		},

		window(_number, index, array) {
			const start = Math.max(0, index - 4);
			const end   = Math.min(array.length, index + 4);
			return _.slice(array, start, end);	
		},
	
		average(data) {
			const avg = this.sum(data) / (data.length || 1);
			return avg.toFixed(3);
		},

		sum(data) {
			return _.reduce(data, (a, b) => Number(a) + Number(b), 0);
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
			return data[data.length-1];
		},

		first(data) {
			return data[0];
		},

		toFixed(value, limit){
			if (value){
				console.log(value);
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
</style>
