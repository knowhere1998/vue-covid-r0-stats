<template>
	<div id="Content">
		{{ activeData }}
		<!-- <label class="switch">
			<input type="checkbox" v-model="checkToggle">
			<span class="slider round"></span>
		</label> -->
<!-- 		<div v-for="state in confirmedData" :key="state.state" class="p-10">
			<LineChart 
				:chartdata="drawChart(state.state, state.dates, state.dailyCount)" 
				:options="chartOptions()"
			/>
		</div>
 -->	</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
// import LineChart from './LineChart.vue'


export default{
	components:{
		// LineChart,
	},
	data() {
		return {
			computeValues: false,
			info: null,
			checkToggle: false
		}
	},

	async beforeCreate(){
		await axios
			.get('https://api.covid19india.org/states_daily.json')
			.then(response => {
				this.info = response.data.states_daily; 
				this.computeValues=true;
			},
			(error) => { console.log(error) }
		);
	},

	filters: {
		toDate(value){
			return moment(String(value)).format("DD/MM/YYYY");
		}
	},

	methods: {
		pivotData(data) {
			let keys = Object.keys(data[0]);
			let pivotedData = [];
			keys.forEach(key=>{
				let obj = {'state': key, 'dates': [], 'dailyCount': [], 'accumulatedCount': []};
				let total = Number(0);
				data.forEach(item=>{
					total += Number(item[key]);
					obj['dates'].push(moment(item['date']).format("DD/MM/YY"));
					obj['dailyCount'].push(Number(item[key]));
					obj['accumulatedCount'].push(total);
				});
				pivotedData.push(obj);
			});
			return pivotedData;
		},

		drawChart(state, dates, dailyCount) {
			return {
				labels: dates,
				datasets: [{
					label: state,
					height: 300,
					width: 350,
					backgroundColor: '#ddd',
					borderColor: '#0000ff',
					data: dailyCount
				}]			
			};
		},
		chartOptions() {
			return {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						},
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						}
					}],
					xAxes: [{
						ticks: {
							beginAtZero: true
						},
						gridLines: {
							color: "rgba(0, 0, 0, 0)",
						}
					}],
				},
				responsive: true,
				maintainAspectRatio: false
			}
		}
	},

	computed: {
		confirmedData () {
			if (this.computeValues) {
				let data = this.info.filter(day=> {return day.status === "Confirmed"});
				data.forEach(item=> delete item.status);
				let pivotedData = this.pivotData(data);
				return pivotedData;
			}else{
				return null;
			}
		},

		deceasedData () {
			if(this.computeValues) {
				let data = this.info.filter(day=> {return day.status === "Deceased"});
				data.forEach(item=> delete item.status);
				let pivotedData = this.pivotData(data);
				console.log("deceasedData");
				console.log(pivotedData);
				return pivotedData;
			}
			return null;
		},

		recoveredData () {
			if(this.computeValues) {
				let data = this.info.filter(day=> {return day.status === "Recovered"});
				data.forEach(item=> delete item.status);
				let pivotedData = this.pivotData(data);
				console.log("revoveredData");
				console.log(pivotedData);
				return pivotedData;
			}
			return null;
		},

		activeData () {
			if (this.computeValues){
				let activeData = [];
				let states = [];
				let dates = this.getDates;
				console.log(dates);
				this.info.forEach(entry=>{
					// if(dates[entry.date])
				});
				return activeData;
			}
			return null;
		},

		getDates () {
			if(this.computeValues) {
				let dates = new Set();
				this.info.forEach(value=>{
					dates.add(value.date);
				});
				return Array.from(dates);
			}
			return null;
		}
	},
}
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