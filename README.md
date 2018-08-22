# zero-width-lib

<p align="center">
  <img width="200" height="200" src="https://user-images.githubusercontent.com/6414178/44472944-dd525880-a661-11e8-9c56-3e73395109c3.png">
</p>

## What's zero-width-lib
Zero-width-lib is a library for manipulating zero width characters (ZWC), which are non-printing and invisible chars.
The common usage of ZWC includes fingerprinting confidential text, embedding hidden text and escaping from string matching (i.e. regex)...
The lib is inspired by this great [medium article](https://medium.com/@umpox/be-careful-what-you-copy-invisibly-inserting-usernames-into-text-with-zero-width-characters-18b4e6f17b66) and mainly got the following features.

1. 😆support full width Unicode chars & cover full test case
2. 0️⃣dependencies & small implementation (570 bytes)
3. ⚡️performance considered
4. 📦support CJS, ESM and UMD


## Install
```
npm install zero-width-lib
```

## Usage
```javascript
// import one method at a time
import { encode } from 'zero-width-lib';
```
```javascript
// or import all methods from lib
import * as z from 'zero-width-lib';
```
```javascript
// note * represents the invisible ZWC
// U+ represents the Unicode for the character

// 0. six different zwc
const dict = z.zeroWidthDict;
console.log(dict.zeroWidthSpace); // '*' U+200B
console.log(dict.zeroWidthNonJoiner); // '*' U+200C
console.log(dict.zeroWidthJoiner); // '*' U+200D
console.log(dict.leftToRightMark); // '*' U+200E
console.log(dict.rightToLeftMark); // '*' U+200F
console.log(dict.zeroWidthNoBreakSpace); // '*' U+FEFF

// 1. convert text
const text = 'text';
const zwc = z.t2z(text); // '********'
const back = z.z2t(zwc); // 'text'

// 2. embed hidden text
const visble = 'hello world';
const hidden = 'inspired by @umpox';
const encoded = z.encode(visible, hidden); // 'h*********ello world'
const decoded = z.decode(encoded); // 'inpired by @umpox'

// 3. extract ZWC from text
const extracted = z.extract(encoded);
const vis = extracted.vis; // 'hello world'
const hid = extracted.hid; // '*********'

// 4. escape from string matching
const forbidden = 'forbidden';
const escaped = z.split(forbidden); // 'f*o*r*b*i*d*d*e*n*' 
```

## License
MIT
