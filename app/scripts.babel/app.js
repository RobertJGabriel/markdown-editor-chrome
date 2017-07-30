'use strict';

const blogJson = 'https://www.teamwork.com/index.cfm?action=whatsnew2';

function sleep(time) {
	const d1 = new Date().getTime();
	let d2 = new Date().getTime();
	while (d2 < d1 + time) {
		d2 = new Date().getTime();
	}
}

new Vue({
	el: '#app',
	data: {
		posts: [],
		numberOfPosts: 0
	},
	beforeCompile: function beforeCompile() {
		sleep(3000);
	},
	mounted() {
		this.fetchPosts();
	},
	methods: {
		fetchPosts() {
			this.$http.get(blogJson).then(response => {
				this.posts = response.body.results;
				this.numberOfPosts = response.body.results.length;
			}, response => {
			});
		}
	}
});
Vue.use(VueMarkdown);
Vue.config.productionTip = false;
