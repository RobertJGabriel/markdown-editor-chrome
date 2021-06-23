export async function isNull(string) {
	return new Promise(async (resolve, reject) => {
		resolve(string === null || string === undefined || string.length === 0);
	});
}

export async function randomNumber(limit) {
	return new Promise(async (resolve, reject) => {
		resolve(Math.floor(Math.random() * limit));
	});
}

export async function uppercaseWords(str) {
	return new Promise(async (resolve, reject) => {
		resolve(
			str
				.replace(/^(.)|\s+(.)/g, (c) => c.toUpperCase())
				.replace('-', ' ')
				.replace(/([a-z])([A-Z])/g, '$1 $2')
		);
	});
}

export async function hexToRGBA(hex, percent = 1) {
	return new Promise(async (resolve, reject) => {
		let c;
		if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
			c = hex.substring(1).split('');
			if (c.length == 3) {
				c = [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c = '0x' + c.join('');
			resolve(
				`rgba(${[(c >> 16) & 255, (c >> 8) & 255, c & 255].join(
					','
				)},${percent})`
			);
		} else {
			resolve(hex);
		}
	});
}

export async function shuffle(array) {
	return new Promise(async (resolve, reject) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		resolve(array);
	});
}

export function strip(HTML) {
	let newHtml = HTML.replace(/(<([^>]+)>)/gi, '');
	let elem = document.createElement('textarea');
	elem.innerHTML = newHtml;
	let decoded = elem.value;
	return decoded;
}

export async function hexToRGB(hex, alpha) {
	return new Promise(async (resolve, reject) => {
		if (hex === undefined || hex === null) return false;
		const r = parseInt(hex.slice(1, 3), 16);
		const g = parseInt(hex.slice(3, 5), 16);
		const b = parseInt(hex.slice(5, 7), 16);
		if (alpha) {
			resolve(`rgba(${r}, ${g}, ${b}, ${alpha})`);
		} else {
			resolve(`rgb(${r}, ${g}, ${b})`);
		}
	});
}

export function disable(id) {
	const ELEM = document.getElementById(id);
	if (ELEM) {
		ELEM.remove();
	}
}

export async function idExists(id) {
	return new Promise(async (resolve, reject) => {
		var myEle = document.getElementById(id);
		if (myEle) {
			resolve(true);
		} else {
			resolve(false);
		}
	});
}

export async function isNumber(number) {
	return new Promise(async (resolve, reject) => {
		resolve(/^[0-9]+$/.test(number));
	});
}

export async function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function newTab(URL) {
	var win = window.open(URL, '_blank');
	win.focus();
}

export async function stripLinks(text) {
	return text.replace(/<a[^>]*>([^<>]*)<\/a>/g, '$1');
}

export async function capitalize(s) {
	let firstChar = /\S/;
	return s.replace(firstChar, function (m) {
		return m.toUpperCase();
	});
}

export async function lineBreak(s) {
	let two_line = /\n\n/g;
	let one_line = /\n/g;
	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
}

export async function emailIsValid(email) {
	return new Promise((resolve) =>
		resolve(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
	);
}

export async function reverseString(string) {
	return new Promise((resolve) =>
		resolve(string.split('').reverse('').join(''))
	);
}

export async function removePxAndPercentage(string) {
	return new Promise((resolve) =>
		resolve(string.toString().replace('px', '').replace('%', ''))
	);
}
export async function isAndroid() {
	return /Android/.test(navigator.userAgent);
}
export async function isCordova() {
	return !!window.cordova;
}
export async function isEdge() {
	return /Edge/.test(navigator.userAgent) || /Edg/.test(navigator.userAgent);
}
export async function isFirefox() {
	return /Firefox/.test(navigator.userAgent);
}
export async function isChrome() {
	return /Google Inc/.test(navigator.vendor);
}
export async function isChromeIOS() {
	return /CriOS/.test(navigator.userAgent);
}
export async function isChromiumBased() {
	return !!window.chrome && !/Edge/.test(navigator.userAgent);
}
export async function isIE() {
	return /Trident/.test(navigator.userAgent);
}
export async function isIOS() {
	return /(iPhone|iPad|iPod)/.test(navigator.platform);
}
export async function isOpera() {
	return /OPR/.test(navigator.userAgent);
}
export async function isSafari() {
	return (
		/Safari/.test(navigator.userAgent) &&
		!/Chrome/.test(navigator.userAgent)
	);
}
export async function isTouchScreen() {
	return (
		'ontouchstart' in window ||
		(window.DocumentTouch && document instanceof DocumentTouch)
	);
}
