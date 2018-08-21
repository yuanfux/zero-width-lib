var assert = require('assert');
var zeroWidthLib = require('../dist/zero-width-lib');

// import lib
var zeroWidthDict = zeroWidthLib.zeroWidthDict;
var Quinary2ZeroMap = Object.keys(zeroWidthDict).map(key => zeroWidthDict[key]);
var t2z = zeroWidthLib.t2z;
var z2t = zeroWidthLib.z2t;
var encode = zeroWidthLib.encode;
var extract = zeroWidthLib.extract;
var decode = zeroWidthLib.decode;
var split = zeroWidthLib.split;
var maxTime = 20000;

// construct a test string
var input = '';

// partial testcase
var testCodeArr = [];
for (var i = 8100 ; i <= 8300 ; i++) {
	// case less than 65536
	// include some zero width characters
	testCodeArr.push(i);
}
for (var i = 65536 ; i <= 65736 ; i++) {
	// case greater than 65536
	// include some 2 width characters
	testCodeArr.push(i);
}
for (var i = 0 ; i < testCodeArr.length ; i++) {
	input += String.fromCodePoint(testCodeArr[i]);
}

// full testcase
// for (var i = 0 ; i <= 0x10FFFF ; i++) {
// 	input += String.fromCodePoint(i);
// }

var regexStr = Quinary2ZeroMap.join('|');
var re = new RegExp(regexStr, 'g');
// construct another test string, which doesn't contain 6 zero width characters used in the lib
var pureInput = input.replace(re, '');

describe('zero-width-lib', function() {
	describe('#zeroWidthDict', function() {
		it('Zero width characters in the dictionary should be unique.', function() {
			const uniqueMap = {};
			let isUnique = true;
			for (const ch of Object.keys(zeroWidthDict)) {
				if(uniqueMap[zeroWidthDict[ch]]) {
					isUnique = false;
					break;
				} else {
					uniqueMap[zeroWidthDict[ch]] = 1;
				}
			}
			assert.equal(isUnique, true);
		});
	});
	describe('#t2z()', function() {
		it('Should return empty string when input is empty.', function() {
			assert.equal('', t2z(''));
		});
	});
	describe('#z2t()', function() {
		it('Should return empty string when input is empty.', function() {
			assert.equal('', z2t(''));
		});
	});
	describe('#t2z() & #z2t()', function() {
		this.timeout(maxTime);
		it('After converting and converting back, the text should be the same.', function() {
			var output = z2t(t2z(input));
			assert.equal(input, output);
		});
	});
	describe('#encode()', function() {
		this.timeout(maxTime);
		it('Should return same string as #t2z() returns when visible text is empty.', function() {
			assert.equal(t2z(input), encode('', input));
		});
		it('Should return same string as visible returns when hidden text is empty.', function() {
			assert.equal(input, encode(input, ''));
		});
		it('Should return empty string when input is empty.', function() {
			assert.equal('', encode('', ''));
		});
	});
	describe('#extract', function() {
		this.timeout(maxTime);
		it('Should return an object with empty vis & hid strings when input is empty.', function() {
			assert.equal('', extract('').hid);
			assert.equal('', extract('').vis);
		});
		var extracted = extract(encode(pureInput, pureInput));
		it('After extracting, visible text should not contain any zero width character.', function() {
			assert.equal(re.test(extracted.vis), false);
		});
		it('After extracting, hidden text should only contain zero width characters.', function() {
			var reExtract = new RegExp('^[' + Quinary2ZeroMap.join('') + ']*$');
			assert.equal(reExtract.test(extracted.hid), true);
		});
	});
	describe('#decode()', function() {
		it('Should return empty string when input text is empty.', function() {
			assert.equal('', decode(''));
		});
	});
	describe('#encode() & #decode()', function() {
		this.timeout(maxTime);
		it('After encoding and decoding, the text should be the same.', function() {
			var decoded = decode(encode(pureInput, pureInput));
			assert.equal(pureInput, decoded);
		});
	});
	describe('#split()', function() {
		this.timeout(maxTime);
		it('Every character should be split with zero width character.', function() {
			var splitted = split(input);
			var splitArr = Array.from(splitted);
			for (var i = 0 ; i < splitArr.length ; i++) {
				if (i % 2) {
					assert.equal(splitArr[i], zeroWidthDict.zeroWidthSpace);
				}
			}
		});
		it('Should return empty string when input text is empty.', function() {
			assert.equal('', split(''));
		});
	});
});