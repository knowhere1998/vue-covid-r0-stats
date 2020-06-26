<template>
	<div class="mb-8 flex">
		<div class="mr-4">
			{{ question }} 
			<div v-if="active">
				{{ answer }}
			</div>
		</div>
	</div>
</template>

<script>
export default {

  name: 'Question',
  props: ['question', 'answer', 'active' ],

  data () {
    return {

    }
  }
};
</script>

<style scoped>
</style>