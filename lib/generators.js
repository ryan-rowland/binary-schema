'use strict';

const C = require('./constants');

function Generators() { };

function unpackString(encoding, name, endian) {
    return [
      `length = buffer.readUInt16${endian}(offset);`,
      `offset += length + 2;`,
      `vars['${name}'] = buffer.toString('${encoding}', offset - length, offset);`
    ];
}

function packString(encoding, name, endian) {
  return [
    `buffer.writeUInt16${endian}(stringLengths['${name}'], offset);`,
    `offset += 2;`,
    `buffer.fill(json['${name}'], offset, offset += stringLengths['${name}'], '${encoding}');`,
  ];
}

Generators.utf8 = Generators.string = {
  unpack: unpackString.bind(null, 'utf8'),
  pack: packString.bind(null, 'utf8'),
  packLength: (name) => {
    return [
      `length = stringLengths['${name}'] = Buffer.byteLength(json['${name}']);`,
      `bufferLength += length + 2;`
    ];
  }
};

Generators.ascii = {
  unpack: unpackString.bind(null, 'ascii'),
  pack: packString.bind(null, 'ascii'),
  packLength: (name) => {
    return [
      `length = stringLengths['${name}'] = json['${name}'].length;`,
      `bufferLength += length + 2;`
    ];
  }
};

Generators.nullable = {
  unpack: (name) => {
    return [
      `if (buffer.readUInt8(offset++) === 0) {`,
        `vars['${name}'] = null;`,
      `} else {`
    ];
  },
  pack: (name) => {
    return [
      `if (json['${name}'] === undefined || json['${name}'] === null) {`,
        `buffer.writeUInt8(0x00, offset++);`,
      `} else {`,
        `buffer.writeUInt8(0x01, offset++);`
    ];
  },
  packLength: (name) => {
    return [
      `bufferLength += 1;`,
      `if (json['${name}'] !== undefined && json['${name}'] !== null) {`,
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
