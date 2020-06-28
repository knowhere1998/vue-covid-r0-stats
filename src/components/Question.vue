<template>
	<div class="mb-8 flex">
		<div class="mr-4">
			<button 
				class="border border-solid border-gray-dark rounded-full w-8 h-8 flex items-center justify-center text-xs text-grey-dark font-bold leading-none cursor-pointer"
				@click="isOpen =! isOpen"
			>
			<svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" class="fill-current">
				<path d="M0 8v1h18v-2h-23z" />
			</svg>		 
			<svg v-else xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" class="fill-current">
				<path d="M12 9H7v5H5V9H0V7h5V2h2v5h5z" />
			</svg>
				
			</button>
		</div>
		<div class="leading-loose">
			<h3 
				class="font-semibold text-xl pt-1 mb-3 text-black leading-none cursor pointer" 
				v-html="question"
				@click= "isOpen = ! isOpen"
			></h3>
			<div v-show="isOpen" v-html="answer"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Question',
	props: ['question', 'answer'],
	data () {
		return {
			'isOpen': false
		}
	}
};
</script>

<style scoped>
</style>