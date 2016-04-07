'use strict';

const Generators = require('./generators');

function BinarySchema(template, options) {
  if (!(this instanceof BinarySchema)) {
    return new BinarySchema(template, options);
  }

  if (!template) {
    throw new Error('template is a required argument');
  }

  options = options || { };
  let defaultEndian = (options.endianess || 'be').toUpperCase();

  const packCode = [];
  const packLengthCode = [];
  const unpackCode = [];

  Object.keys(template).sort().forEach(name => {
    const typeParts = template[name].match(/^([a-zA-Z0-9]+)(\?)?$/).slice(1);
    const type = typeParts[0];
    const isNullable = typeParts[1] === '?';

    if (isNullable) {
      Array.prototype.push.apply(packCode, Generators.nullable.pack(name));
      Array.prototype.push.apply(unpackCode, Generators.nullable.unpack(name));
      Array.prototype.push.apply(packLengthCode, Generators.nullable.packLength(name));
    }

    Array.prototype.push.apply(packCode, Generators[type].pack(name, defaultEndian));
    Array.prototype.push.apply(unpackCode, Generators[type].unpack(name, defaultEndian));
    Array.prototype.push.apply(packLengthCode, Generators[type].packLength(name, defaultEndian));

    if (isNullable) {
      packCode.push('}');
      unpackCode.push('}');
      packLengthCode.push('}');
    }
  });

  Object.defineProperties(this, {
    pack: { enumerable: true, value: _compilePack(packLengthCode, packCode) },
    unpack: { enumerable: true, value: _compileUnpack(unpackCode) }
  });
};

function _compilePack(lengthCode, code) {
  const lines = [];

  lines.push('offset = offset || 0;');
  lines.push('var bufferLength = offset;');
  lines.push('var length = 0;');
  lines.push('var stringLengths = { };');
  lines.push.apply(lines, lengthCode);

  lines.push('var buffer = new Buffer(bufferLength);');
  lines.push.apply(lines, code);
  lines.push('return buffer;');

  return new Function('json', 'offset', lines.join('\n'));
};

function _compileUnpack(code) {
  const lines = [];

  lines.push('offset = offset || 0;');
  lines.push('var start = 0;');
  lines.push('var vars = {};');
  lines.push.apply(lines, code);
  lines.push('return vars;');

  return new Function('buffer', 'offset', lines.join('\n'));
};

module.exports = BinarySchema;
