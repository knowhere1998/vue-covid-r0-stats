<template>
	<div id="app">
		<Nav />
		<Content class="flex-grow" />
		<Footer />
	</div>
</template>

<script>
import Nav from './components/Nav.vue'
import Content from './components/Content.vue'
import Footer from './components/Footer.vue'

export default {
	name: 'App',
	components: {
		Nav,
		Content,
		Footer
	}
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	display: flex;
	min-height: 100vh;
	flex-direction: column;
}
</style>
