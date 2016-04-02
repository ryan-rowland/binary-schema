'use strict';

const SAMPLE_COUNT = 500000;

const colors = require('colors/safe');
const BinarySchema = require('../lib');
const Graph = require('./graph');

(function () {
  const results = [
    runSingleBenchmark('int8', -12),
    runSingleBenchmark('uint8', 255),
    runSingleBenchmark('int16', -12000),
    runSingleBenchmark('uint16', 25555),
    runSingleBenchmark('int32', -12000000),
    runSingleBenchmark('uint32', 25555555),
    runSingleBenchmark('float', -12345),
    runSingleBenchmark('double', 1234567.89123),
    runSingleBenchmark('string', 'qux'),
    runSingleBenchmark('hex', 'deadbeef')
  ];

  const labels = [
    'int8', 'uint8', 'int16', 'uint16', 'int32',
    'uint32', 'float', 'double', 'string', 'hex'];

  const packSpeeds = { name: 'BinarySchema.pack', data: [] };
  const stringifySpeeds = { name: 'JSON.stringify', data: [] };

  const unpackSpeeds = { name: 'BinarySchema.unpack', data: [] };
  const parseSpeeds = { name: 'JSON.parse', data: [] };

  results.forEach(result => {
    packSpeeds.data.push(result.packRate);
    stringifySpeeds.data.push(result.stringifyRate);
    unpackSpeeds.data.push(result.unpackRate);
    parseSpeeds.data.push(result.parseRate);
  });

  //console.info(Graph.getUrl(labels, stringifySpeeds, packSpeeds));
  //console.info(Graph.getUrl(labels, parseSpeeds, unpackSpeeds));

  /*console.info('All Primitives');
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
  });*/
})();

function runSingleBenchmark(type, value) {
  console.info(type);
  return runBenchmark(
    { foo: type },
    { foo: value }
  );
}

function runBenchmark(template, data) {
  const packet = new BinarySchema(template);

  const packStart = Date.now();
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    packet.pack(data);
  }

  const packRate = (SAMPLE_COUNT / (Date.now() - packStart));

  const unpackStart = Date.now();
  const packed = packet.pack(data);
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    packet.unpack(packed);
  }

  const unpackRate = (SAMPLE_COUNT / (Date.now() - unpackStart));

  const stringifyStart = Date.now();
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    JSON.stringify(data);
  }

  const stringifyRate = (SAMPLE_COUNT / (Date.now() - stringifyStart));

  const parseStart = Date.now();
  const stringified = JSON.stringify(data);
  for (let i = 0; i < SAMPLE_COUNT; i++) {
    JSON.parse(stringified);
  }

  const parseRate = (SAMPLE_COUNT / (Date.now() - parseStart));

  const parseResult = `  JSON.parse: ${parseRate.toFixed(0)}k/sec |` +
    ` unpack: ${unpackRate.toFixed(0)}k/sec`;

  const stringifyResult = `  JSON.stringify: ${stringifyRate.toFixed(0)}k/sec |` +
    ` pack: ${packRate.toFixed(0)}k/sec`;

  console.info(colors[parseRate > unpackRate ? 'red' : 'green'](parseResult));
  console.info(colors[stringifyRate > packRate ? 'red' : 'green'](stringifyResult));

  return {
    packRate, parseRate,
    unpackRate, stringifyRate
  };
}
