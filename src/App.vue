<template>
  <div id="app">
    <Nav/>
    <Content/>
  </div>
</template>

<script>
import Nav from './components/Nav.vue'
import Content from './components/Content.vue'

export default {
  name: 'App',
  components: {
    Nav,
    Content
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
