# phash-image

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

  [pHash](http://www.phash.org/) for images in node.js.

  Phash is a library that will create a "perceptual hash" of media files, so similar files will return similar hashes. Typically to compare hashes,
  a simple [Hamming distance](http://en.wikipedia.org/wiki/Hamming_distance) between the two hashes is a good indicator of how similar two
  media files are.

## Installation

phash-image depends on [CImg](http://cimg.sourceforge.net/), [pHash](http://www.phash.org/), [ImageMagicK](http://www.imagemagick.org/).

On Ubuntu:

```bash
sudo apt-get install cimg-dev libphash0-dev libmagickcore-dev
```

On OSX:

```bash
brew install phash imagemagick
```

Then, install using npm:

```bash
$ npm install phash-image
```

## API

### phash(filename, [returnBigInt], [callback]).then( hash => )

```js
var phash = require('phash-image');
// with a callback
phash(filename, (err, hash) => );
// as a promise
phash(filename).then( hash => );
```

If you want to return a ulong64 as a string to store in a database,
set `true` as the second parameter.

```js
phash(filename, true).then( bigint => )
```

### phash.mh(filename, [callback]).then( hash => )

Phash's [MH](http://www.phash.org/docs/design.html) 72-byte length hash.
This is slower, but should be more accurate.

```js
phash.mh(filename).then( hash => )
```

### Comparing phashes

To compare phashes, use [hamming-distance](https://github.com/math-utils/hamming-distance).

[npm-image]: https://img.shields.io/npm/v/phash-image.svg?style=flat-square
[npm-url]: https://npmjs.org/package/phash-image
[github-tag]: http://img.shields.io/github/tag/mgmtio/phash-image.svg?style=flat-square
[github-url]: https://github.com/mgmtio/phash-image/tags
[travis-image]: https://img.shields.io/travis/mgmtio/phash-image.svg?style=flat-square
[travis-url]: https://travis-ci.org/mgmtio/phash-image
[coveralls-image]: https://img.shields.io/coveralls/mgmtio/phash-image.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/mgmtio/phash-image
[david-image]: http://img.shields.io/david/mgmtio/phash-image.svg?style=flat-square
[david-url]: https://david-dm.org/mgmtio/phash-image
[license-image]: http://img.shields.io/npm/l/phash-image.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/phash-image.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/phash-image
[gittip-image]: https://img.shields.io/gratipay/jonathanong.svg?style=flat-square
[gittip-url]: https://gratipay.com/jonathanong/
