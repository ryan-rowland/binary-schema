'use strict';

const C = require('./constants');

function Generators() { };

Generators.hex = {
  unpack: (name, endian) => {
    return [
      `length = buffer.readUInt16${endian}(offset);`,
      `offset += length + 2;`,
      `vars['${name}'] = buffer.toString('hex', offset - length, offset);`
    ];
  },
  pack: (name, endian) => {
    return [
      `buffer.writeUInt16${endian}(stringLengths['${name}'], offset);`,
      `offset += 2;`,
      `buffer.fill(json['${name}'], offset, offset += stringLengths['${name}'], 'hex');`,
    ];
  },
  packLength: (name) => {
    return [
      `length = stringLengths['${name}'] = json['${name}'].length / 2;`,
      `bufferLength += length + 2;`
    ];
  }
};

Generators.string = {
  unpack: (name, endian) => {
    return [
      `length = buffer.readUInt16${endian}(offset);`,
      `offset += length + 2;`,
      `vars['${name}'] = buffer.toString('utf8', offset - length, offset);`
    ];
  },
  pack: (name, endian) => {
    return [
      `buffer.writeUInt16${endian}(stringLengths['${name}'], offset);`,
      `offset += 2;`,
      `buffer.fill(json['${name}'], offset, offset += stringLengths['${name}']);`,
    ];
  },
  packLength: (name) => {
    return [
      `length = stringLengths['${name}'] = Buffer.byteLength(json['${name}']);`,
      `bufferLength += length + 2;`
    ];
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
