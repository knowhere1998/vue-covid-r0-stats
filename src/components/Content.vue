<template>
	<div id="Content">
		<div class="lg:p-4"	v-if="activeData">
			<div v-if="states">
				<div class=" border bg-white shadow-lg">
					<div class="lg:flex">
						<ul class="list-reset w-1/3 lg:flex px-5 py-3">
							<li class="mr-3 pt-1">
								<a class="cursor-pointer inline-block py-1 px-3 border rounded-lg"
								@click="selector = 1"
								:class="{
									'border-blue bg-blue-500 text-white' : selector === 1, 
									'border-white hover:border-grey-lighter text-blue-500 hover:bg-grey-lighter' : selector != 1
								}" >Latest</a>
							</li>
							<li class="mr-3 pt-1">
								<a class="cursor-pointer inline-block py-1 px-3 border rounded-lg"
								@click="selector = 2"
								:class="{
									'border-blue bg-blue-500 text-white' : selector === 2, 
									'border-white hover:border-grey-lighter text-blue-500 hover:bg-grey-lighter' : selector != 2
								}" >Last Week</a>
							</li>
							<li class="mr-3 pt-1">
								<a class="cursor-pointer inline-block py-1 px-3 border rounded-lg"
								@click="selector = 3"
								:class="{
									'border-blue bg-blue-500 text-white' : selector === 3, 
									'border-white hover:border-grey-lighter text-blue-500 hover:bg-grey-lighter' : selector != 3
								}" >1 month ago</a>
							</li>
						</ul>
						<div class="w-2/3 lg:flex justify-end">
							<div class="inline-block lg:px-5 px-3 lg:py-5 py-2">
								<div class="flow-root lg:text-xl sm:text-sm lg:text-center lg:font-bold text-red-800">
									Confirmed: {{ countryWideConfirmedTotal }} ({{ countryWideConfirmedDelta | getNumber }})
								</div>
							</div>
							<div class="inline-block lg:px-5 px-3 lg:py-5 py-2">
								<div class="flow-root lg:text-xl sm:text-sm lg:text-center lg:font-bold text-blue-800">
									Active: {{ countryWideActiveTotal }} ({{ countryWideActiveDelta | getNumber }})
								</div>
							</div>
							<div class="inline-block lg:px-5 px-3 lg:py-5 py-2">
								<div class="flow-root lg:text-xl sm:text-sm lg:text-center lg:font-bold text-green-800">
									Recovered: {{ countryWideRecoveredTotal }} ({{ countryWideRecoveredDelta | getNumber }})
								</div>
							</div>
						</div>
					</div>
					<div class="lg:p-5 pt-5">
						<ScatterChart height=400 showLabels=true :chartName="chartDate" type= "scatter" :categories="getStates" :data="getRtData(rtData)" :annotationValue="countryWideRt" />
					</div>
				</div>
				<div class="p-4 mt-5 bg-white border shadow-lg">
					<div class="inline">
						<v-select multiple :options="getStates" v-model="selectedStates"></v-select>
						<div class="pt-1 text-sm lg:pl-5 font-semibold" v-text="'Select or type in state names to see their respective information'"></div>
					</div>
					<div v-if="selectedStates" class="py-2 lg:px-5">
						<div class="lg:flex lg:divide-x content-between">
							<div class="w-1/2 py-2">
								<div class="pt-1 text-sm font-semibold" v-text="'Select starting range for the data'"></div>
								<ul class="list-reset lg:pl-5 lg:flex">
									<li class="mr-3 pt-2">
										<a class="cursor-pointer inline-block py-1 px-3 border rounded-lg"
										@click="rangeSelector = 1"
										:class="{
											'border-blue bg-blue-500 text-white' : rangeSelector === 1, 
											'border-white hover:border-grey-lighter text-blue-500 hover:bg-grey-lighter' : rangeSelector != 1
										}" >Since Last Fortnight</a>
									</li>
									<li class="mr-3 pt-2">
										<a class="cursor-pointer inline-block py-1 px-3 border rounded-lg"
										@click="rangeSelector = 2"
										:class="{
											'border-blue bg-blue-500 text-white' : rangeSelector === 2, 
											'border-white hover:border-grey-lighter text-blue-500 hover:bg-grey-lighter' : rangeSelector != 2
										}" >Since 1 month</a>
									</li>
									<li class="mr-3 pt-2">
										<a class="cursor-pointer inline-block py-1 px-3 border rounded-lg"
										@click="rangeSelector = 3"
										:class="{
											'border-blue bg-blue-500 text-white' : rangeSelector === 3, 
											'border-white hover:border-grey-lighter text-blue-500 hover:bg-grey-lighter' : rangeSelector != 3
										}" >From the beginning</a>
									</li>
								</ul>
							</div>
							<div class="w-1/2 py-1 lg:pl-5">
								<div class="mr-3 pt-10 px-5">
									<span>&nbsp; Growth &nbsp;</span>
									<toggle-button class="p-1" v-model="dataToggle" color="#38b2ac" />
									<span>&nbsp; Cummulative &nbsp;</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="mt-5" v-for="selectedState in selectedStates" :key="selectedState">
					<StateInfo 
						:state="selectedState"
						:dateList="dateList" 
						:confirmedData="confirmedData" 
						:activeData="activeData" 
						:rtData="rtData" 
						:recoveredData="recoveredData"
						:dateRange="dateRange"
						:dataToggle="dataToggle"
						:rangeSelector="rangeSelector"
						:dates="dates"
					/>
				</div>
			</div>
		</div>
		<div class="p-10 text-center font-bold" v-else>
			<div class="p-10 text-2xl">
				Please wait while we crunch the data!
			</div>
			<pulse-loader :loading="! activeData" size="20px"></pulse-loader>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import StateInfo from './StateInfo.vue';
import ScatterChart from './ScatterChart.vue';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import CONSTANTS from './../constants.js';

export default{
	components:{
		StateInfo,
		PulseLoader,
		ScatterChart
	},
	props: ['lastUpdated'],
	data() {
		return {
			states: null,
			activeData: null,
			confirmedData: null,
			recoveredData: null,
			deceasedData: null,
			rtData: null,
			dataToggle: true,
			dateList: false,
			dateRange: false,
			computeValues: false,
			selectedStates: [],
			rangeSelector: 0,
			selector: 0,
			countryWideConfirmedDelta: 0,
			countryWideConfirmedTotal: null,
			countryWideActiveDelta: 0,
			countryWideActiveTotal: null,
			countryWideRecoveredDelta: 0,
			countryWideRecoveredTotal: null,
			countryWideRt: null,
			chartDate: null
		}
	},

	mounted(){
		let getData = new Promise((resolve, reject) => {
			axios.get(
					CONSTANTS.API_URL + '/json', {
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
					this.rtData = response.data.rtData;
					let lastUpdated = moment(response.data.lastUpdated).format('Do-MMM-YYYY hh:mm A')
					this.$emit('update:lastUpdated', lastUpdated);
					resolve('Success!');
					this.selectedStates.push(this.states.filter(record => {return record.statecode == "mh";})[0]['state']);
				},
				(error) => { 
					console.log(error);
					reject('Error!');
				}
			);
		});
		getData.then(() =>{
			this.rangeSelector = 1;
			this.selector = 1;
		}, error=>{
			console.log(error);
		});
	
	},

	watch: {
		rangeSelector: function (val) {
			let dates = [];
			if (val == 1){
				dates = this.dates.slice(Math.max(this.dates.length - 15, 0));
			}else if (val == 2){
				dates = this.dates.slice(Math.max(this.dates.length - 30, 0));
			}else {
				dates = this.dates;
			}
			this.dateRange 	= [dates[0], dates.slice(-1)[0]];
			this.dateList 	= dates.map(value=> {return moment(value).format('DD-MMM-YY')});
		},

		selector: function (val) {
			let date = [];
			if (val == 1){
				date = this.dates.slice(-1)[0];
			}else if (val == 2){
				date = this.dates.slice(Math.max(this.dates.length - 15, 0))[0];
			}else {
				date = this.dates.slice(Math.max(this.dates.length - 30, 0))[0];
			}
			let filteredConfirmedData = this.confirmedData.filter(record => { return record['date'] == date });
			let filteredActiveData = this.activeData.filter(record => { return record['date'] == date });
			let filteredRecoveredData = this.recoveredData.filter(record => { return record['date'] == date });
			let filteredRtData = this.rtData.filter(record => { return record['date'] == date });
			
			let oldDate = filteredRtData[0]['rt_date'];
			let filteredOldRtData = this.rtData.filter(record => { return record['date'] == oldDate });
			
			this.countryWideConfirmedDelta = filteredConfirmedData.reduce(function (result, item) {
				return result + item.delta;
			}, 0);
			this.countryWideActiveDelta = filteredActiveData.reduce(function (result, item) {
				return result + item.delta;
			}, 0);
			this.countryWideRecoveredDelta = filteredRecoveredData.reduce(function (result, item) {
				return result + item.delta;
			}, 0);
			this.countryWideConfirmedTotal = filteredConfirmedData.reduce(function (result, item) {
				return result + item.accumulated;
			}, 0);
			this.countryWideActiveTotal = filteredActiveData.reduce(function (result, item) {
				return result + item.accumulated;
			}, 0);
			this.countryWideRecoveredTotal = filteredRecoveredData.reduce(function (result, item) {
				return result + item.accumulated;
			}, 0);
			let countryWideRtTotal = filteredRtData.reduce(function (result, item) {
				return result + item.accumulated15;
			}, 0);
			let countryWideOldRtTotal = filteredOldRtData.reduce(function (result, item) {
				return result + item.accumulated15;
			}, 0);
			this.countryWideRt =  (countryWideRtTotal / countryWideOldRtTotal).toFixed(2);
			this.chartDate = "Rt as of " + moment(date).format("DD-MMM-YY");
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

		getNumber(value) {
			if (value > 0) {
				return "+" + value;
			} else {
				return value.toString();
			}
		},
	},

	methods: {
		getRtData(data) {
			let lastValues = [];
			let date = null;
			if (this.selector == 1){
				date = moment(this.dates[this.dates.length - 1]);
			} else if (this.selector == 2) {
				date = moment(this.dates[this.dates.length - 7]);
			} else {
				date = moment(this.dates[this.dates.length - 30]);
			}
			this.getStates.forEach(state=>{
				let lastValue = data.filter(record=>{
					return record['state'] === state && date.isSame(record['date']);
				}).splice(-1)[0];
				lastValue = (lastValue['rt']) ? lastValue['rt'].toFixed(2): 0;
				lastValues.push(lastValue);
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