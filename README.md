@keeex/bubble_babble
====================

Bubble Babble encoding.

Initially forked from tylorr/bubble\_babble to avoid the dependency on `Buffer`, thus making this
library work in more JavaScript environments.

Installation
------------
Installation is done from npmjs:

```bash
npm install @keeex/bubble_babble
```

Usage
-----

```JavaScript
import {encode, decode} from "@keeex/bubble_babble/lib/bubble_babble.js";

const encoded = encode("Pineapple");
console.log(encoded); // "xigak-nyryk-humil-bosek-sonax"

const ab = decode("xesef-disof-gytuf-katof-movif-baxux");
const ascii = new TextDecoder().decode(ab);
console.log(ascii); // "1234567890"
```

`encode()` accepts input as UTF8 string, `ArrayBuffer` or `Uint8Array`.
`decode()` returns an `ArrayBuffer`.

There is a secondary export `@keeex/bubblebabble/web/bubble_babble.js` that can be used in
browser environment.
It should be possible to directly import `@keeex/bubble_babble` but this depend on your
environment/bundler.
