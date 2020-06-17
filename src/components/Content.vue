<template>
	<div id="Content" class="m-10 p-6">
		<div class="p-10" v-if="activeData">
			<div class="selector" v-if="states">
				Select State: 
				<v-select multiple :options="getStates" v-model="selectedStates"></v-select>
			</div>
			bi-weekly
			<label class="switch">
				<input type="checkbox" v-model="rangeToggle">
				<span class="slider round"></span>
			</label>
			monthly
			<div v-if="selectedStates">
				<div class="p-2" v-for="selectedState in selectedStates" :key="selectedState">
					<h3 class="h-12 w-full text-center text-2xl">{{ selectedState }}</h3>
					<div class="flex">
						<div class="w-2/3 p-6">
							<h4>Confirmed Cases</h4>
							<LineChart class="p-6"
								:chartData="drawChart(selectedState, dateList, mapAccumulated(confirmedData, selectedState, dateRange), '#0000ff')" 
								:options="chartOptions()"
								:height="200"
							/>
							<h4>Active Cases</h4>
							<LineChart
								:chartData="drawChart(selectedState, dateList, mapAccumulated(activeData, selectedState, dateRange), '#ff0000')" 
								:options="chartOptions()"
								:height="200"
							/>
							<h4>Recovered Cases</h4>
							<LineChart
								:chartData="drawChart(selectedState, dateList, mapAccumulated(recoveredData, selectedState, dateRange), '#00ff00')" 
								:options="chartOptions()"
								:height="200"
							/>
						</div>
						<div class="w-1/3 bg-green-100 p-10">
							Current R-Nought:
							<div class="text-2xl p-32">{{ rNought(selectedState) }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="p-10" v-else>
			No Records!
		</div>	
	</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import LineChart from './LineChart.vue';

export default{
	components:{
		LineChart,
	},
	data() {
		return {
			states: null,
			activeData: null,
			confirmedData: null,
			recoveredData: null,
			deceasedData: null,
			dateList: null,
			dateRange: null,
			rangeToggle: false,
			computeValues: false,
			info: null,
			selectedStates: null
		}
	},

	async mounted(){
		await axios
			.get('https://api.covid19india.org/v2/state_district_wise.json')
			.then(response => {
				this.states = [];
				response.data.forEach(state=>{
					delete state.districtData;
					state.statecode = state.statecode.toLowerCase();
					this.states.push(state);
				});
			},
			(error) => { console.log(error) }
		);
		await axios
			.get('https://api.covid19india.org/states_daily.json')
			.then(response => {
				this.info = response.data.states_daily; 
				this.computeValues=true;
			},
			(error) => { console.log(error) }
		);
	},

	watch: {
		rangeToggle: function (val) {
			if (val)
				this.dateList = this.getLastMonth();
			else
				this.dateList = this.getLastFifteenDays();		
		},

		computeValues: function () {
			if (this.computeValues){
				this.activeData = []; 
				this.confirmedData = []; 
				this.recoveredData = []; 
				this.deceasedData = [];
				this.dateList = this.getLastFifteenDays();
				this.getDates.forEach(date=>{
					let confirmedDeltas = this.info.filter(entry=> {
						return entry.status === "Confirmed" && entry.date === date.format('DD-MMM-YY')
					});
					let recoveredDeltas = this.info.filter(entry=> {
						return entry.status === "Recovered" && entry.date === date.format('DD-MMM-YY')
					});
					let deceasedDeltas 	= this.info.filter(entry=> {
						return entry.status === "Deceased" && entry.date === date.format('DD-MMM-YY')
					});
					this.accumulateDeltas(confirmedDeltas[0], date, this.confirmedData);
					this.accumulateDeltas(recoveredDeltas[0], date, this.recoveredData);
					this.accumulateDeltas(deceasedDeltas[0], date, this.deceasedData);
					this.accumulateActiveDeltas(date);
				});
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
	},

	methods: {
		accumulateDeltas(data, date, arr) {
			this.states.forEach(state=>{
				let delta = Number(data[state.statecode])
				let filteredArr = arr.filter(entry=>{return entry.state === state.state});
				let prev = Number((filteredArr.length > 0) ? filteredArr.slice(-1)[0]['accumulated']: 0);
				let total = delta + prev
				arr.push({"state": state.state, "date": date, "delta": delta, "accumulated": total});
			});
		},

		accumulateActiveDeltas(date, arr = this.activeData) {
				this.states.forEach(state=>{
				let confirmedEntry 	= this.confirmedData.filter(entry=> {return entry.state === state.state && entry.date === date})[0];
				let recoveredEntry 	= this.recoveredData.filter(entry=> {return entry.state === state.state && entry.date === date})[0];
				let deceasedEntry 	= this.deceasedData.filter(entry=> {return entry.state === state.state && entry.date === date})[0];
				let delta = Number(confirmedEntry.delta) - Number(recoveredEntry.delta) - Number(deceasedEntry.delta);
				let total = Number(confirmedEntry.accumulated) - Number(recoveredEntry.accumulated) - Number(deceasedEntry.accumulated);
				arr.push({"state": state.state, "date": date, "delta": delta, "accumulated": total});
			});
		},

		mapAccumulated(data, state, dateRange) {
			data = data.filter(record=>{
				return record['state'] === state && record['date'] >= dateRange[0] && record['date'] <= dateRange[1];
			}).map(record => {
				return record['accumulated'];
			});
			return data;
		},

		drawChart(state, dates, data, color) {
			return {
				labels: dates,
				datasets: [{
					label: state,
					height: 300,
					width: 350,
					backgroundColor: '#ddd',
					borderColor: color,
					data: data
				}]
			};
		},

		chartOptions() {
			return {
				scales: {
					yAxes: [{
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						}
					}],
					xAxes: [{
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						}
					}],
				},
				responsive: true,
				maintainAspectRatio: false
			}
		},

		getLastFifteenDays() {
			this.dateRange = this.getRangeLastFifteenDays();
			let dates = this.getDates.slice(Math.max(this.getDates.length - 15, 0));
			return dates.map(value=> value.format('DD-MMM-YY'));
		},

		getLastMonth() {
			this.dateRange = this.getRangeLastMonth();
			let dates = this.getDates.slice(Math.max(this.getDates.length - 30, 0));
			return dates.map(value=> value.format('DD-MMM-YY'));
		},

		getRangeLastFifteenDays() {
			let data = this.getDates.slice(Math.max(this.getDates.length - 15, 0));
			return [data[0], data.slice(-1)[0]];
		},

		getRangeLastMonth() {
			let data = this.getDates.slice(Math.max(this.getDates.length - 30, 0));
			return [data[0], data.slice(-1)[0]];
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
			console.log(numerator);
			console.log(denominator);
			console.log(numerator/denominator);
			console.log(parseFloat(numerator/denominator));
			return parseFloat(numerator/denominator);
		}
	},


	computed: {
		getDates () {
			if(this.computeValues) {
				let dates = new Set();
				this.info.forEach(value=>{
					dates.add(value.date);
				});
				let data =  Array.from(dates);
				return data.map(value=> {return moment(value)});
			}
			return null;
		},

		getStates() {
			let states = this.states.map(x => x['state']);
			return states.sort();
		}
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