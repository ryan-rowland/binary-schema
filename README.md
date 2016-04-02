# json-packet
Blazing fast two-way serialization between JSON and binary packet bodies using a shared JSON template.
Creates a payload much smaller than JSON, and performs faster than JSON.parse and JSON.stringify.

# Example Usage
```js
import JsonPacket from 'json-packet';

const characterPacket = new JsonPacket({
  name: 'string',
  race: 'uint8',
  class: 'uint8',
  maxHp: 'uint32'
});

const binary = characterPacket.pack({
  name: 'osom',
  race: 3,
  class: 7,
  maxHp: 3500
});

// binary === <Buffer 07 00 00 0d ac 00 04 6f 73 6f 6d 03>
// binary.length === 12

const json = characterPacket.unpack(binary);

// json === { class: 7, maxHp: 3500, name: 'osom', race: 3 }
// JSON.stringify(json).length === 47
```
