const zeroWidthNonJoiner = '‌';
const zeroWidthJoiner = '‍';
const zeroWidthSpace = '​';
const zeroWidthNoBreakSpace = '﻿';
const leftToRightMark = '‎';
const rightToLeftMark = '‏';

export const zeroWidthDict = {
	leftToRightMark,
	rightToLeftMark,
	zeroWidthNonJoiner,
	zeroWidthJoiner,
	zeroWidthNoBreakSpace,
	zeroWidthSpace
};

const Quinary2ZeroMap = Object.keys(zeroWidthDict).map(key => zeroWidthDict[key]);
const Zero2QuinaryMap = 
	Quinary2ZeroMap.reduce((acc, cur, index) => {
		acc[cur] = '' + index;
		return acc;
	}, {});

export function t2z(t) {
	let z = '';
	for (let i = 0 ; i < t.length ; i++) {
		const base10 = t.codePointAt(i);
		const base5 = base10.toString(5);
		let zero = '';
		for (let j = 0 ; j < base5.length ; j++) {
			// quinary to zero width chars
			// may be able to extend to other base
			zero += Quinary2ZeroMap[+base5.charAt(j)];
		}
		// skip low surrogate
		i = base10 < 0x10000 ? i : i + 1;
		z += i === t.length - 1 ? zero : zero + zeroWidthSpace;
	}
	return z;
}

export function z2t(z) {
	let t = '';
	// return empty string when input is empty
	if (z.length === 0) {
		return t;
	}
	const chars = z.split(zeroWidthSpace);
	for (let i = 0 ; i < chars.length ; i++) {
		let base5 = '';
		for (let j = 0 ; j < chars[i].length ; j++) {
			base5 += Zero2QuinaryMap[chars[i].charAt(j)];
		}
		t += String.fromCodePoint(parseInt(base5, 5));
	}
	return t;
}

export function encode(vis, hid) {
	let e = '';
	// convert hidden text to zero width chars
	const hid2z = t2z(hid);
	// if visible text is empty
	// return zero width chars directly
	if (vis.length === 0) {
		return hid2z;
	}
	// otherwise insert zero width chars
	// after the first character
	// try to prevent user from not copying zero width chars
	let isAdded = false;
	for (const ch of vis) {
		e += ch;
		if (!isAdded) {
			e += hid2z;
			isAdded = true;
		}
	}
	return e;
}

export function extract(t) {
	let vis = '';
	let hid = '';
	for (const ch of t) {
		if (Zero2QuinaryMap[ch]) {
			hid += ch;
		} else {
			vis += ch;
		}
	}
	return {
		vis,
		hid
	}
}

export function decode(vis) {
	// decode a visible text
	return z2t(extract(vis).hid);
}

export function split(t) {
	// split text with zero width chars
	let s = '';
	for (const ch of t) {
		s += ch;
		s += zeroWidthSpace;
	}
	return s;
}
