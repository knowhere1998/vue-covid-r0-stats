<template>
	<div class="container">
		<div
			class="fixed inset-0 w-full h-screen flex items-center justify-center bg-gray-300 bg-opacity-75"
			@click.self="closeModal()"
			v-if="showModal">
			<div class="modal-container overflow-y-auto w-full relative max-h-screen lg:max-w-5xl my-4 bg-white shadow-lg rounded-lg p-8">
				<h1 class="text-3xl mb-5">FAQs</h1>
				<a
					aria-label="close"
					class="absolute top-0 right-0 text-xl text-gray-500 my-2 mx-4 cursor-pointer"
					@click.prevent="closeModal()"
					tabindex="0"
				> × </a>
				<div class="question-wrapper divide-y">
					<div v-for="question in questions" :key="question.question">
						<Question :question="question.question" :answer="question.answer" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import Question from './Question.vue'
import CONSTANTS from './../constants.js'

export default {
	name: 'FaqModal',
	props: [
		'showModal',
	],
	components: {
		Question,
	},
	showModal (value) {
		if (value) {
			return document.querySelector('#app').classList.add('overflow-hidden');
		}
		document.querySelector('#app').classList.remove('overflow-hidden');
	},
	data() {
		return {
			"questions": CONSTANTS.questions
		};
	},
	methods: {
		closeModal () {
			this.$emit('closeModal');
		}
	}
};
</script>

<style scoped>
</style>