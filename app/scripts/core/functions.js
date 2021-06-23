'use strict';

/**
 * @param  {} params
 */
function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}
exports.shuffle = shuffle;

/**
 * @param  {} params
 */
function isNull(string) {
	if (string === null || string === undefined) {
		return true;
	} else {
		return false;
	}
}
exports.isNull = isNull;

/**
 * @param  {} params
 */
function isNumber(number) {
	return /^[0-9]+$/.test(number);
}
exports.isNumber = isNumber;

/**
 * @param  {} params
 */
function emailIsValid(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
exports.emailIsValid = emailIsValid;

/**
 * @param  {} params
 */
function reverseString(string) {
	return string.split('').reverse('').join('');
}

exports.reverseString = reverseString;
