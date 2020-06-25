<template>
	<div id="Content" class="lg:m-10 lg:p-6 lg:flex justify-around">
		<div class="lg:p-4 lg:w-3/4"  v-if="activeData">
			<div v-if="states">
				<div class="p-10">	
					<CandleStickChart height=500 showLabels=true chartName="Rt-stateWise"  type= "candlestick" :dateList="getStates" color="#ff0000" :data="getRtData(activeData)" />
				</div>

				<div class="text-lg inline">
					Select State: 
				</div>
				<div class="inline">
					<v-select multiple :options="getStates" v-model="selectedStates"></v-select>
				</div>
				<div v-if="selectedStates">
					<div class="filters flex p-4 content-between">
						<div class="rangeToggle">
							<span>bi-weekly</span>
							<toggle-button class="p-1" v-model="rangeToggle" color="#38b2ac"/>
							<span>Last Month</span>
						</div>
						<div class="dataToggle pl-10">
							<toggle-button class="p-1" v-model="dataToggle" color="#38b2ac"/>
							<span>Cummulative</span>
						</div>
					</div>
					
					<div class="p-2" v-for="selectedState in selectedStates" :key="selectedState">
						<StateInfo 
							:state="selectedState"
							:dateList="dateList" 
							:confirmedData="confirmedData" 
							:activeData="activeData" 
							:recoveredData="recoveredData"
							:dateRange="dateRange"
							:dataToggle="dataToggle"
							:rangeToggle="rangeToggle"
							:dates="dates"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="p-10 text-center font-bold" v-else>
			<div class="p-10 text-2xl">
				Please wait while we crunch the data!
			</div>
			<pulse-loader :loading="! activeData" size="20px"></pulse-loader>
		</div>
		<div class="lg:w-1/4">
			<Sidebar />
		</div>
	</div>
</template>

<script>
import Sidebar from './Sidebar.vue'

import axios from 'axios';
import moment from 'moment';
import StateInfo from './StateInfo.vue';
import CandleStickChart from './CandleStickChart.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default{
	components:{
		Sidebar,
		StateInfo,
		PulseLoader,
		CandleStickChart
	},
	data() {
		return {
			states: null,
			activeData: null,
			confirmedData: null,
			recoveredData: null,
			deceasedData: null,
			dataToggle: true,
			dateList: false,
			dateRange: false,
			rangeToggle: false,
			computeValues: false,
			selectedStates: []
		}
	},

	mounted(){
		let getData = new Promise((resolve, reject) => {
			axios.get(
					'https://sheltered-stream-87921.herokuapp.com/json', {
						headers: {
							"Access-Control-Allow-Origin": "*",
							"Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
							"Access-Control-Allow-Headers": "Origin, Content-Type, X-Auth-Token"
						}
					}
			).then(response => {
					this.dates = response.data.dates;
					this.states = response.data.states;
					this.activeData = response.data.activeData;
					this.confirmedData = response.data.confirmedData;
					this.recoveredData = response.data.recoveredData;
					this.deceasedData = response.data.deceasedData;
					resolve('Success!');
					this.selectedStates.push(this.states.filter(record => {return record.statecode == "mh";})[0]['state']);
				},
				(error) => { 
					console.log(error);
					reject('Error!');
				}
			);
		});
		getData.then(value=>{
			console.log(value);
			let dates = [];
			if (this.rangeToggle){
				dates = this.dates.slice(Math.max(this.dates.length - 30, 0));
			}else {
				dates = this.dates.slice(Math.max(this.dates.length - 15, 0));
			}
			this.dateRange 	= [dates[0], dates.slice(-1)[0]];
			this.dateList 	= dates.map(value=> {return moment(value).format('DD-MMM-YY')});
		}, error=>{
			console.log(error);
		});
	
	},

	watch: {
		rangeToggle: function (val) {
			let dates = [];
			if (val){
				dates = this.dates.slice(Math.max(this.dates.length - 30, 0));
			}else {
				dates = this.dates.slice(Math.max(this.dates.length - 15, 0));
			}
			this.dateRange 	= [dates[0], dates.slice(-1)[0]];
			this.dateList 	= dates.map(value=> {return moment(value).format('DD-MMM-YY')});
		},
	},

	filters: {
		toDate(value){
			return moment(String(value)).format("DD/MM/YYYY");
		},

		last(data) {
			return data.splice(-1)[0];
		},

		first(data) {
			return data[0];
		},
	},

	methods: {
		getRtData(data) {
			let lastValues = [];
			this.getStates.forEach(state=>{
				let lastValue = data.filter(record=>{
					return record['state'] === state;
				});
				lastValue = lastValue.slice(Math.max(lastValue.length - 4, 0)).map(record=> { return (record['rt']) ? record['rt'].toFixed(2): 0 });
				lastValues.push({'x': state, 'y': lastValue});
			});
			return lastValues;
		},
	
	},


	computed: {
		getStates() {
			let states = this.states.map(x => x['state']);
			return states.sort();
		},

	},
};
</script>

<style scoped>
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	/* Hide default HTML checkbox */
	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: .4s;
		transition: .4s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: .4s;
		transition: .4s;
	}

	input:checked + .slider {
		background-color: #2196F3;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #2196F3;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>