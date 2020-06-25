<template>
	<div id="app">
		<Nav />
		<div class="lg:flex">
			<Content class="lg:w-3/4" />
			<Sidebar class="lg:w-1/4" />
		</div>
	</div>
</template>

<script>
import Sidebar from './components/Sidebar.vue'
import Nav from './components/Nav.vue'
import Content from './components/Content.vue'

export default {
	name: 'App',
	components: {
		Nav,
		Content,
		Sidebar,
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
