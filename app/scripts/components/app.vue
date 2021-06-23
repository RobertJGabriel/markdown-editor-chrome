<template>
	<div class="h-full w-full">
		<!--- Markdown Toolbar --->

		<div class="navbar bg-neutral text-neutral-content">
			<div class="flex-1 px-2 mx-2">
				<span class="text-lg font-bold"> Markdown Editor </span>
			</div>
			<div class="flex-none">
				<button
					class="btn btn-ghost btn-sm rounded-btn"
					title="Save readme."
					v-on:click="saveLocally"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="inline-block w-5 mr-2 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
						/>
					</svg>
					Save
				</button>
				<button
					class="btn btn-ghost btn-sm rounded-btn"
					title="Print markdown."
					v-on:click="print"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="inline-block w-5 mr-2 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
						/>
					</svg>

					Print
				</button>
				<button
					class="btn btn-ghost btn-sm rounded-btn"
					title="Export to HTML"
					target="blank"
					v-on:click="exportHTML"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="inline-block w-5 mr-2 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
						/>
					</svg>
					HTML
				</button>

				<button
					class="btn btn-ghost btn-sm rounded-btn"
					v-on:click="help"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="inline-block w-5 mr-2 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>

					Help
				</button>

				<a
					class="btn btn-ghost btn-sm rounded-btn"
					:href="reviewUsLink"
					target="_blank"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="inline-block w-5 mr-2 stroke-current"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>

					Review us
				</a>
			</div>
		</div>

		<!--- Content --->
		<div class="grid grid-cols-2 gap-4 p-4">
			<div class="form-control h-screen w-full">
				<textarea
					class="textarea h-screen w-full rounded-none"
					v-model="editor"
					v-on:keyup="changeHandler()"
				></textarea>
			</div>

			<div
				class="h-screen w-full"
				id="preview"
				v-if="!showHTML"
				v-html="compiledMarkdown"
			>
			</div>

			<div class="h-screen w-full" v-if="showHTML">
				{{ compiledMarkdown }}
			</div>
		</div>

		<iframe id="printArea" class="hide"></iframe>
	</div>
</template>

<script>
	import Vue from 'vue';
	import Strings from './core/strings';
	import * as FUNCTIONS from './core/functions';
	import './index.css';

	import i18n from 'vue-plugin-webextension-i18n';

	import marked from 'marked';
	import hljs from 'highlightjs';

	import 'highlightjs/styles/solarized-dark.css';

	Vue.use(i18n);
	export default {
		inject: ['notyf'],
		data: function () {
			return {
				title: '',
				reviewUsLink:
					'https://chrome.google.com/webstore/detail/markdown-editor-for-chrom/dkpldbigkfcgpamifjimiejipmodkigk/reviews',

				editor: Strings.markdownString(),
				showHTML: false,

				messagesFound: ''
			};
		},

		computed: {
			compiledMarkdown() {
				return marked(this.editor, {
					langPrefix: 'hljs '
				});
			}
		},

		async mounted() {
			const code = this.editor;
			marked.setOptions({
				highlight(code) {
					return hljs.highlightAuto(code).value;
				}
			});
			this.reviewUsLink = await this.reviewLink();
			hljs.initHighlighting();
			this.load();
		},
		methods: {
			async reviewLink() {
				return new Promise(async (resolve, reject) => {
					if ((await FUNCTIONS.isEdge()) === true) {
						resolve(
							'https://microsoftedge.microsoft.com/addons/Microsoft-Edge-Extensions-Home'
						);
					}

					if ((await FUNCTIONS.isFirefox()) === true) {
						resolve(
							'https://addons.mozilla.org/en-US/firefox/addon/markdown-editor-premium/reviews/'
						);
					}

					if ((await FUNCTIONS.isChrome()) === true) {
						resolve(
							'https://chrome.google.com/webstore/detail/markdown-editor-for-chrom/dkpldbigkfcgpamifjimiejipmodkigk/reviews'
						);
					} else {
						resolve(
							'https://chrome.google.com/webstore/detail/markdown-editor-for-chrom/dkpldbigkfcgpamifjimiejipmodkigk/reviews'
						);
					}
				});
			},
			exportHTML: function exportHTML() {
				this.showHTML = this.showHTML ? false : true;
			},
			help: function help() {
				window.location.href = 'https://www.coffeeandfun.com/#support';
			},
			save: function save(input) {
				this.snackbar('Saved');
				return localStorage.setItem('storedData', input);
			},
			print: function print() {
				this.showHTML = false;
				const printIframe = document.getElementById('printArea');
				printIframe.contentWindow.document.body.innerHTML =
					document.getElementById('preview').innerHTML;
				printIframe.contentWindow.focus(); // focus on contentWindow is needed on some ie versions
				printIframe.contentWindow.print();
				return false;
			},

			changeHandler() {
				this.save(this.editor);
				return marked(this.editor);
			},
			saveLocally() {
				this.snackbar('Downloading');
				//  Escape HTML
				const link = document.createElement('a');
				link.download = 'README.md';
				link.href = `data:text/plain,${this.editor}`;
				link.click(); // trigger click/download
			},

			load: function () {
				// Make the api request
				// Check if local storage is enabled
				if (localStorage.getItem('storedData') !== null) {
					// Load the data if needed
					this.snackbar('Loading...');
					this.editor = localStorage.getItem('storedData');
				}
			},

			save: function (token, type) {
				let setting = {};
				setting[token] = type;
				chrome.storage.sync.set(setting);
				return setting;
			},
			snackbar: function (message, type = 'success') {
				if (
					message === undefined ||
					message === '' ||
					message === null
				) {
					message = this.$i18n('upgrade_message');
					type = 'error';
				}
				switch (type) {
					case 'success':
						this.notyf.success(message);
						break;
					case 'error':
						this.notyf.error(message);
						break;
					default:
						this.notyf.success(message);
				}
			}
		}
	};
</script>

<style scoped></style>
