'use strict';

const colors = require('colors/safe');
const JsonPacket = require('../lib');

(function () {
  runSingleBenchmark('string', 'qux');
  runSingleBenchmark('int8', -12);
  runSingleBenchmark('uint8', 255);
  runSingleBenchmark('int16', -12000);
  runSingleBenchmark('uint16', 25555);
  runSingleBenchmark('int32', -12000000);
  runSingleBenchmark('uint32', 25555555);
  runSingleBenchmark('float', -12345);
  runSingleBenchmark('double', 1234567.89123);

  console.info('All Primitives');
  runBenchmark({
    string: 'string',
    int8: 'int8',
    uint8: 'uint8',
    int16: 'int16',
    uint16: 'uint16',
    int32: 'int32',
    uint32: 'uint32',
    float: 'float',
    double: 'double'
  }, {
    string: 'qux',
    int8: -12,
    uint8: 255,
    int16: -12000,
    uint16: 25555,
    int32: -12000000,
    uint32: 25555555,
    float: -12345,
    double: 1234567.89123
  });
})();

function runSingleBenchmark(type, value) {
  console.info(type);
  return runBenchmark(
    { foo: type },
    { foo: value }
  );
}

function runBenchmark(template, data) {
  const packet = new JsonPacket(template);

  const packStart = Date.now();
  for (let i = 0; i < 500000; i++) {
    packet.pack(data);
  }

  const packRate = (500000 / (Date.now() - packStart));

  const unpackStart = Date.now();
  const packed = packet.pack(data);
  for (let i = 0; i < 500000; i++) {
    packet.unpack(packed);
  }

  const unpackRate = (500000 / (Date.now() - unpackStart));

  const stringifyStart = Date.now();
  for (let i = 0; i < 500000; i++) {
    JSON.stringify(data);
  }

  const stringifyRate = (500000 / (Date.now() - stringifyStart));

  const parseStart = Date.now();
  const stringified = JSON.stringify(data);
  for (let i = 0; i < 500000; i++) {
    JSON.parse(stringified);
  }

  const parseRate = (500000 / (Date.now() - parseStart));

  const parseResult = `  JSON.parse: ${parseRate.toFixed(0)}k/sec |` +
    ` unpack: ${unpackRate.toFixed(0)}k/sec`;

  const stringifyResult = `  JSON.stringify: ${stringifyRate.toFixed(0)}k/sec |` +
    ` pack: ${packRate.toFixed(0)}k/sec`;

  console.info(colors[parseRate > unpackRate ? 'red' : 'green'](parseResult));
  console.info(colors[stringifyRate > packRate ? 'red' : 'green'](stringifyResult));
}
