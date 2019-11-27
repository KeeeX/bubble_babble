bubble_babble
=============

Bubble Babble encoding for nodejs.

Initially forked from tylorr/bubble\_babble to avoid the dependency on `Buffer`.


**Install**
-------

The built package is not published on any repository; either install the
original package, or install from github:

```bash
npm install https://github.com/KeeeX/bubble_babble.git
```

**Usage**
-----

```JavaScript
const bubble = require("bubble_babble");

const encoded = bubble.encode("Pineapple");
console.log(encoded); // "xigak-nyryk-humil-bosek-sonax"

const ascii = bubble.decode("xesef-disof-gytuf-katof-movif-baxux");
console.log(ascii); // "1234567890"
```
