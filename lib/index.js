'use strict';

const Generators = require('./generators');

function JsonPacket(template, options) {
  if (!(this instanceof JsonPacket)) {
    return new JsonPacket(template, options);
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
    const type = template[name];

    Array.prototype.push.apply(packCode, Generators[type].pack(name, defaultEndian));
    Array.prototype.push.apply(unpackCode, Generators[type].unpack(name, defaultEndian));
    Array.prototype.push.apply(packLengthCode, Generators[type].packLength(name, defaultEndian));
  });

  Object.defineProperties(this, {
    pack: { enumerable: true, value: _compilePack(packLengthCode, packCode) },
    unpack: { enumerable: true, value: _compileUnpack(unpackCode) }
  });
};

function _compilePack(lengthCode, code) {
  const lines = [];

  lines.push('var bufferLength = 0;');
  lines.push('var length = 0;');
  lines.push('var stringLengths = { };');
  lines.push.apply(lines, lengthCode);

  lines.push('var buffer = new Buffer(bufferLength);');
  lines.push('var offset = 0;');
  lines.push.apply(lines, code);
  lines.push('return buffer;');

  return new Function('json', lines.join('\n'));
};

function _compileUnpack(code) {
  const lines = [];

  lines.push('var offset = 0;');
  lines.push('var start = 0;');
  lines.push('var vars = {};');
  lines.push.apply(lines, code);
  lines.push('return vars;');

  return new Function('buffer', lines.join('\n'));
};

module.exports = JsonPacket;
