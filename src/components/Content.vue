<template>
	<div id="Content">
		<div class="lg:p-4"	v-if="activeData">
			<div v-if="states">
				<ul class="list-reset flex px-5 py-3">
					<li class="mr-3">
						<a class="inline-block border rounded-lg"
						@click="selected = 1"
						:class="{
							'border-blue py-1 px-3 bg-blue-500 text-white' : selected === 1, 
							'border-white hover:border-grey-lighter text-blue-500 hover:bg-grey-lighter py-1 px-3' : selected != 1
						}"
						href="#">Latest</a>
					</li>
					<li class="mr-3">
						<a class="inline-block border rounded-lg"
						@click="selected = 2"
						:class="{
							'border-blue py-1 px-3 bg-blue-500 text-white' : selected === 2, 
							'border-white hover:border-grey-lighter text-blue-500 hover:bg-grey-lighter py-1 px-3' : selected != 2
						}"
						href="#">Last Week</a>
					</li>
					<li class="mr-3">
						<a class="inline-block border rounded-lg"
						@click="selected = 3"
						:class="{
							'border-blue py-1 px-3 bg-blue-500 text-white' : selected === 3, 
							'border-white hover:border-grey-lighter text-blue-500 hover:bg-grey-lighter py-1 px-3' : selected != 3
						}"
						href="#">1 month ago</a>
					</li>
				</ul>
				<div class="lg:p-5 border shadow-lg">	
					<ScatterChart height=400 showLabels=true :chartName="getChartName()" type= "scatter" :categories="getStates" :data="getRtData(activeData)" />
				</div>
				<div class="pt-10">
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
								<toggle-button class="p-1" v-model="rangeToggle" color="#38b2ac" />
								<span>Last Month</span>
							</div>
							<div class="dataToggle pl-10">
								<span>Growth</span>
								<toggle-button class="p-1" v-model="dataToggle" color="#38b2ac" />
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
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default{
	components:{
		StateInfo,
		PulseLoader,
		ScatterChart
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
			selectedStates: [],
			selected: 1
		}
	},

	mounted(){
		let getData = new Promise((resolve, reject) => {
			axios.get(
					'https://node-covid-data.herokuapp.com/json', {
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
		getChartName() {
			return "Rt-latest";
		},

		getRtData(data) {
			let lastValues = [];
			let date = null;
			if (this.selected == 1){
				date = moment(this.dates[this.dates.length - 1]);
			} else if (this.selected == 2) {
				date = moment(this.dates[this.dates.length - 7]);
			} else {
				date = moment(this.dates[this.dates.length - 30]);
			}
			console.log(date);
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