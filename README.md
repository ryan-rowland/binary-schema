# binary-schema
Blazing fast two-way serialization between JSON and binary. Creates a payload
smaller than JSON by using a shared schema, and performs faster than JSON.parse
and JSON.stringify.

### In Progress
This package is a work in progress. Other data types will be supported in the
future. Currently these data types are supported: [string, hex, int8, uint8,
int16, uint16, int32, uint32, float, double].

# Example Usage
```js
import BinarySchema from 'binary-schema';

const characterSchema = new BinarySchema({
  name: 'string',
  race: 'uint8',
  class: 'uint8',
  maxHp: 'uint32'
});

const binary = characterSchema.pack({
  name: 'osom',
  race: 3,
  class: 7,
  maxHp: 3500
});

// binary === <Buffer 07 00 00 0d ac 00 04 6f 73 6f 6d 03>
// binary.length === 12

const json = characterSchema.unpack(binary);

// json === { class: 7, maxHp: 3500, name: 'osom', race: 3 }
// JSON.stringify(json).length === 47
```

# Benchmarks

###pack
![pack vs stringify](https://chart.googleapis.com/chart?cht=bvg&chtt=Operations+per+second+in+thousands&chts=%2C%2C&chd=t%3A2659.574468085106%2C2604.1666666666665%2C2590.6735751295337%2C2631.5789473684213%2C2450.9803921568628%2C2512.5628140703516%2C2604.1666666666665%2C1908.3969465648854%2C2645.5026455026455%2C2631.5789473684213%7C3164.5569620253164%2C3472.222222222222%2C3472.222222222222%2C3267.97385620915%2C3289.4736842105262%2C3448.2758620689656%2C2890.173410404624%2C2890.173410404624%2C1453.4883720930231%2C1366.120218579235&chco=FF0000%2C0000FF&chdl=JSON.stringify%7CBinarySchema.pack&chds=a&chxt=y%2Cx&chxl=1%3A%7Cint8%7Cuint8%7Cint16%7Cuint16%7Cint32%7Cuint32%7Cfloat%7Cdouble%7Cstring%7Chex&chbh=a%2C4%2C23&chdlp=b%7Cl&chs=600x400)

###unpack
![unpack vs parse](https://chart.googleapis.com/chart?cht=bvg&chtt=Operations+per+second+in+thousands&chts=%2C%2C&chd=t%3A2688.1720430107525%2C2659.574468085106%2C2325.5813953488373%2C2747.252747252747%2C2538.0710659898477%2C2688.1720430107525%2C2688.1720430107525%2C2032.520325203252%2C2577.319587628866%2C2551.0204081632655%7C33333.333333333336%2C38461.53846153846%2C41666.666666666664%2C38461.53846153846%2C33333.333333333336%2C35714.28571428572%2C14285.714285714286%2C11627.906976744185%2C7142.857142857143%2C3731.3432835820895&chco=FF0000%2C0000FF&chdl=JSON.parse%7CBinarySchema.unpack&chds=a&chxt=y%2Cx&chxl=1%3A%7Cint8%7Cuint8%7Cint16%7Cuint16%7Cint32%7Cuint32%7Cfloat%7Cdouble%7Cstring%7Chex&chbh=a%2C4%2C23&chdlp=b%7Cl&chs=600x400)
