<template>
	<div id="Content">
		<div v-for="state in confirmed_data" :key="state.state" class="flex bg-gray-200">
			<div class="w-1/2">
				<h1>lorem</h1>
<!-- 				<LineChart :chartdata="drawChart(state.state, state.dates, state.dailyCount)" :options="chartOptions()" />
 -->			</div>
			<div class="w-1/2">
				<h1>lorem</h1>
				<!-- <LineChart :chartdata="drawChart(state.state, state.dates, state.accumulated_count)" :options="chartOptions()" /> -->
			</div>
		</div>
	</div>
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
			compute_values: false,
			info: null
		}
	},

	beforeCreate(){
		axios
			.get('https://api.covid19india.org/states_daily.json')
			.then(response => {
				this.info = response.data.states_daily; 
				this.compute_values=true;
			},
			(error) => { console.log(error) }
		);
	},

	filters: {
		to_date(value){
			return moment(String(value)).format("DD/MM/YYYY");
		}
	},

	methods: {
		pivotData(data) {
			let keys = Object.keys(data[0]);
			let pivoted_data = [];
			keys.forEach(key=>{
				let obj = {'state': key, 'dates': [], 'dailyCount': [], 'accumulated_count': []};
				let total = Number(0);
				data.forEach(item=>{
					total += Number(item[key]);
					obj['dates'].push(moment(item['date']).format("DD/MM/YY"));
					obj['dailyCount'].push(Number(item[key]));
					obj['accumulated_count'].push(total);
				});
				pivoted_data.push(obj);
			});
			return pivoted_data;
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
		confirmed_data () {
			if (this.compute_values){
				let data = this.info.filter(day=> {return day.status === "Confirmed"});
				data.forEach(item=> delete item.status);
				let pivoted_data = this.pivotData(data);
				return pivoted_data;
			}else{
				return null;
			}
		},

		deceased_data () {
			if(this.compute_values){
				let data = this.info.filter(day=> {return day.status === "Deceased"});
				data.forEach(item=> delete item.status);
				//TODO: Add Pivot Logic
				return data;
			}
			return null;
		},

		recovered_data () {
			if(this.compute_values){
				let data = this.info.filter(day=> {return day.status === "Recovered"});
				data.forEach(item=> delete item.status);
				//TODO: Add Pivot Logic
				return data;
			}
			return null;
		},

		get_dates () {
			if(this.compute_values){
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
	
</style>