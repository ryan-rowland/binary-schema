'use strict';

const assert = require('assert');
const BinarySchema = require('../lib');

describe('offset parameter', function() {
  it('should be obeyed for pack and unpack', () => {
    const schema = new BinarySchema({
      foo: 'int16'
    });

    const packed = schema.pack({ foo: -12345 }, 2);
    packed.writeInt16BE(789, 0);

    const unpacked1 = schema.unpack(packed);
    const unpacked2 = schema.unpack(packed, 2);

    assert.deepEqual(packed, new Buffer([0x03, 0x15, 0xcf, 0xc7]));
    assert.deepEqual(unpacked1, { foo: 789 });
    assert.deepEqual(unpacked2, { foo: -12345 });
  })
});

describe('string', function() {
  it('should correctly pack and unpack a string', () => {
    const schema = new BinarySchema({
      foo: 'string'
    });
    const data = { foo: 'bar' };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(packed, new Buffer([0x00, 0x03, 0x62, 0x61, 0x72]));
    assert.deepEqual(unpacked, data);
  });

  it('should correctly pack and unpack an ascii string', () => {
    const schema = new BinarySchema({
      foo: 'ascii'
    });
    const data = { foo: 'bar' };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(packed, new Buffer([0x00, 0x03, 0x62, 0x61, 0x72]));
    assert.deepEqual(unpacked, data);
  });

  it('should correctly pack and unpack a utf8 string with extended characters', () => {
    const schema = new BinarySchema({
      foo: 'utf8'
    });
    const data = { foo: '\u0012\ubeef' };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(packed, new Buffer([0x00, 0x04, 0x12, 0xeb, 0xbb, 0xaf]));
    assert.deepEqual(unpacked, data);
  });
});

describe('primitives', function() {
  it('should correctly pack and unpack an int8', () => {
    const schema = new BinarySchema({
      foo: 'int8'
    });
    const data = { foo: -12 };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0xf4 ]));
  });

  it('should correctly pack and unpack a uint8', () => {
    const schema = new BinarySchema({
      foo: 'uint8'
    });
    const data = { foo: 255 };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0xff ]));
  });

  it('should correctly pack and unpack an int16', () => {
    const schema = new BinarySchema({
      foo: 'int16'
    });
    const data = { foo: -12000 };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0xd1, 0x20 ]));
  });

  it('should correctly pack and unpack a uint16', () => {
    const schema = new BinarySchema({
      foo: 'uint16'
    });
    const data = { foo: 25555 };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0x63, 0xd3 ]));
  });

  it('should correctly pack and unpack an int32', () => {
    const schema = new BinarySchema({
      foo: 'int32'
    });
    const data = { foo: -12000000 };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0xff, 0x48, 0xe5, 0x00 ]));
  });

  it('should correctly pack and unpack a uint32', () => {
    const schema = new BinarySchema({
      foo: 'uint32'
    });
    const data = { foo: 25555555 };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0x01, 0x85, 0xf2, 0x63 ]));
  });

  it('should correctly pack and unpack a float', () => {
    const schema = new BinarySchema({
      foo: 'float'
    });
    const data = { foo: -123.45 };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.equal(unpacked.foo.toFixed(2), data.foo);
    assert.deepEqual(packed, new Buffer([ 0xc2, 0xf6, 0xe6, 0x66 ]));
  });

  it('should correctly pack and unpack a double', () => {
    const schema = new BinarySchema({
      foo: 'double'
    });
    const data = { foo: 1234567.89123 };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([
      0x41, 0x32, 0xd6, 0x87,
      0xe4, 0x27, 0xa6, 0x37
    ]));
  });

  it('should correctly pack and unpack a nullable double (null)', () => {
    const schema = new BinarySchema({
      foo: 'double?'
    });
    const data = { foo: null };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0x00 ]));
  });

  it('should correctly pack and unpack a nullable double (undefined)', () => {
    const schema = new BinarySchema({
      foo: 'double?'
    });
    const data = { };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, { foo: null });
    assert.deepEqual(packed, new Buffer([ 0x00 ]));
  });

  it('should correctly pack and unpack a nullable double (not null)', () => {
    const schema = new BinarySchema({
      foo: 'double?'
    });
    const data = { foo: 1234567.89123 };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([ 0x01,
      0x41, 0x32, 0xd6, 0x87,
      0xe4, 0x27, 0xa6, 0x37
    ]));
  });

  it('should correctly pack and unpack a big template', () => {
    const schema = new BinarySchema({
      7: 'double',
      6: 'uint32?',
      5: 'int32',
      4: 'uint16?',
      3: 'int16',
      2: 'uint8',
      1: 'int8?',
      8: 'string?',
      9: 'ascii'
    });
    const data = {
      1: -12,
      2: 255,
      3: -12000,
      5: -12000000,
      6: 25555555,
      4: 25555,
      7: 1234567.89123,
      8: null,
      9: 'qux'
    };

    const packed = schema.pack(data);
    const unpacked = schema.unpack(packed);

    assert.deepEqual(unpacked, data);
    assert.deepEqual(packed, new Buffer([
      0x01, 0xf4,
      0xff,
      0xd1, 0x20,
      0x01, 0x63, 0xd3,
      0xff, 0x48, 0xe5, 0x00,
      0x01, 0x01, 0x85, 0xf2, 0x63,
      0x41, 0x32, 0xd6, 0x87,
      0xe4, 0x27, 0xa6, 0x37,
      0x00,
      0x00, 0x03, 0x71, 0x75, 0x78
    ]));
  });
});
