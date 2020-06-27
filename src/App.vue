<template>
	<div id="app" class="bg-gray-200">
		<Nav :modalStatus.sync="faqModalShow" :lastUpdated="lastUpdated" />
		<div class="lg:flex">
			<Content class="lg:w-3/4" :lastUpdated.sync="lastUpdated" />
			<Sidebar :modalStatus.sync="faqModalShow" class="lg:w-1/4" />
		</div>
        <faq-modal :showModal="faqModalShow" @closeModal="faqModalShow = false"></faq-modal>
	</div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Content from './components/Content.vue'
import Nav from './components/Nav.vue'

export default {
	name: 'App',
	components: {
		Nav,
		Content,
		Sidebar,
	},
	data() {
		return {
			faqModalShow: false,
			lastUpdated: null
		};
	}
};
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@300;400&display=swap');

#app {
	font-family: 'Fira Sans', sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	display: flex;
	min-height: 100vh;
	flex-direction: column;
}
</style>
