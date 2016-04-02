'use strict';

const assert = require('assert');
const JsonPacket = require('../lib');

describe('.string', function() {
  it('should correctly pack and unpack a string', () => {
    const packet = new JsonPacket({
      foo: 'string'
    });
    const data = { foo: 'bar' };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(packed, new Buffer([0x00, 0x03, 0x62, 0x61, 0x72]));
    assert.deepEqual(unpacked, data);
  });

  it('should correctly pack and unpack a string with extended characters', () => {
    const packet = new JsonPacket({
      foo: 'string'
    });
    const data = { foo: '\u0012\ubeef' };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(packed, new Buffer([0x00, 0x04, 0x12, 0xeb, 0xbb, 0xaf]));
    assert.deepEqual(unpacked, data);
  });
});

describe('.hex', function() {
  it('should correctly pack and unpack a hex string', () => {
    const packet = new JsonPacket({
      foo: 'hex'
    });
    const data = { foo: 'deadbeef' };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(packed, new Buffer([0x00, 0x04, 0xde, 0xad, 0xbe, 0xef]));
    assert.deepEqual(unpacked, data);
  });
});

describe('primitives', function() {
  it('should correctly pack and unpack an int8', () => {
    const packet = new JsonPacket({
      foo: 'int8'
    });
    const data = { foo: -12 };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0xf4 ]));
  });

  it('should correctly pack and unpack a uint8', () => {
    const packet = new JsonPacket({
      foo: 'uint8'
    });
    const data = { foo: 255 };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0xff ]));
  });

  it('should correctly pack and unpack an int16', () => {
    const packet = new JsonPacket({
      foo: 'int16'
    });
    const data = { foo: -12000 };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0xd1, 0x20 ]));
  });

  it('should correctly pack and unpack a uint16', () => {
    const packet = new JsonPacket({
      foo: 'uint16'
    });
    const data = { foo: 25555 };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0x63, 0xd3 ]));
  });

  it('should correctly pack and unpack an int32', () => {
    const packet = new JsonPacket({
      foo: 'int32'
    });
    const data = { foo: -12000000 };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0xff, 0x48, 0xe5, 0x00 ]));
  });

  it('should correctly pack and unpack a uint32', () => {
    const packet = new JsonPacket({
      foo: 'uint32'
    });
    const data = { foo: 25555555 };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0x01, 0x85, 0xf2, 0x63 ]));
  });

  it('should correctly pack and unpack a float', () => {
    const packet = new JsonPacket({
      foo: 'float'
    });
    const data = { foo: -123.45 };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.equal(unpacked.foo.toFixed(2), data.foo);
    assert.deepEqual(packed, new Buffer([ 0xc2, 0xf6, 0xe6, 0x66 ]));
  });

  it('should correctly pack and unpack a double', () => {
    const packet = new JsonPacket({
      foo: 'double'
    });
    const data = { foo: 1234567.89123 };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([
      0x41, 0x32, 0xd6, 0x87,
      0xe4, 0x27, 0xa6, 0x37
    ]));
  });

  it('should correctly pack and unpack a big template', () => {
    const packet = new JsonPacket({
      7: 'double',
      6: 'uint32',
      5: 'int32',
      4: 'uint16',
      3: 'int16',
      2: 'uint8',
      1: 'int8',
      8: 'string',
      9: 'string'
    });
    const data = {
      1: -12,
      2: 255,
      3: -12000,
      5: -12000000,
      6: 25555555,
      4: 25555,
      7: 1234567.89123,
      8: 'bar',
      9: 'qux'
    };

    const packed = packet.pack(data);
    const unpacked = packet.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([
      0xf4,
      0xff,
      0xd1, 0x20,
      0x63, 0xd3,
      0xff, 0x48, 0xe5, 0x00,
      0x01, 0x85, 0xf2, 0x63,
      0x41, 0x32, 0xd6, 0x87,
      0xe4, 0x27, 0xa6, 0x37,
      0x00, 0x03, 0x62, 0x61, 0x72,
      0x00, 0x03, 0x71, 0x75, 0x78
    ]));
  });
});
