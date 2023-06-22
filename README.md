bubble_babble
=============

Bubble Babble encoding for nodejs.

Initially forked from tylorr/bubble\_babble to avoid the dependency on `Buffer`.

Notes:
The package available on NPMJS named `@keeex/bubble_babble` was based on this repository but got
more updates.
This repository is now archived and will not receive anymore updates.

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
import {encode, decode} from "@keeex/bubble_babble";

const encoded = encode("Pineapple");
console.log(encoded); // "xigak-nyryk-humil-bosek-sonax"

const ascii = decode("xesef-disof-gytuf-katof-movif-baxux");
console.log(ascii); // "1234567890"
```

Typescript
----------
This module includes type definition for usage with TypeScript
