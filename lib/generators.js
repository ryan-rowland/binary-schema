'use strict';

const C = require('./constants');

function Generators() { };

Generators.string = {
  unpack: (name) => {
    return [
      `start = offset;`,
      `while(buffer.readUInt8(offset++) !== 0);`,
      `vars['${name}'] = buffer.toString('utf8', start, offset - 1);`
    ];
  },
  pack: (name) => {
    return [
      `buffer.fill(json['${name}'], offset, offset += Buffer.byteLength(json['${name}'], \'utf8\'));`,
      'buffer.writeInt8(0x00, offset++);'
    ];
  },
  packLength: (name) => {
    return [`bufferLength += Buffer.byteLength(json['${name}']) + 1;`];
  }
};

Object.keys(C.PRIMITIVE_SIZES).forEach(type => {
  const size = C.PRIMITIVE_SIZES[type];

  Generators[type.toLowerCase()] = createPrimitive(type, size);
});

function createPrimitive(type, size) {
  return {
    unpack: (name, endian) => {
      endian = (size > 1) ? endian : '';
      return [
        `vars['${name}'] = buffer.read${type}${endian}(offset);`,
        `offset += ${size};`
      ];
    },
    pack: (name, endian) => {
      endian = (size > 1) ? endian : '';
      return [
        `buffer.write${type}${endian}(json['${name}'], offset);`,
        `offset += ${size};`
      ];
    },
    packLength: () => {
      return [`bufferLength += ${size};`];
    }
  };
};

module.exports = Generators;
