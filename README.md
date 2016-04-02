# json-packet
Blazing fast two-way serialization between JSON and binary packet bodies using a shared JSON template.
Creates a payload much smaller than JSON, and performs faster than JSON.parse and JSON.stringify.

### In Progress
This package is a work in progress. Other data types will be supported in the future. Currently these
data types are supported: [string, int8, uint8, int16, uint16, int32, uint32, float, double].

# Example Usage
```js
import JsonPacket from 'json-packet';

const characterPacket = new JsonPacket({
  name: 'string',
  race: 'uint8',
  class: 'uint8',
  maxHp: 'uint32'
});

const binary = characterPacket.pack({
  name: 'osom',
  race: 3,
  class: 7,
  maxHp: 3500
});

// binary === <Buffer 07 00 00 0d ac 00 04 6f 73 6f 6d 03>
// binary.length === 12

const json = characterPacket.unpack(binary);

// json === { class: 7, maxHp: 3500, name: 'osom', race: 3 }
// JSON.stringify(json).length === 47
```

# Benchmarks

###pack
![pack vs stringify](http://chart.googleapis.com/chart?cht=bvg&chtt=Operations+per+second+in+thousands&chts=%2C%2C&chd=t%3A2631.5789473684213%2C2702.7027027027025%2C2762.4309392265195%2C2688.1720430107525%2C2702.7027027027025%2C2577.319587628866%2C2551.0204081632655%2C2673.7967914438505%2C1915.7088122605364%7C1524.3902439024391%2C3401.360544217687%2C3472.222222222222%2C3448.2758620689656%2C3378.3783783783783%2C3424.6575342465753%2C3424.6575342465753%2C2923.9766081871344%2C2923.9766081871344&chco=FF0000%2C0000FF&chdl=JSON.stringify%7CJsonPacket.pack&chds=a&chxt=y%2Cx&chxl=1%3A%7Cstring%7Cint8%7Cuint8%7Cint16%7Cuint16%7Cint32%7Cuint32%7Cfloat%7Cdouble&chbh=a%2C4%2C23&chdlp=b%7Cl&chs=600x400)

###unpack
![unpack vs parse](http://chart.googleapis.com/chart?cht=bvg&chtt=Operations+per+second+in+thousands&chts=%2C%2C&chd=t%3A2617.801047120419%2C2793.2960893854747%2C2824.858757062147%2C2793.2960893854747%2C2793.2960893854747%2C2793.2960893854747%2C2762.4309392265195%2C2793.2960893854747%2C2155.1724137931033%7C7042.2535211267605%2C33333.333333333336%2C38461.53846153846%2C41666.666666666664%2C35714.28571428572%2C33333.333333333336%2C35714.28571428572%2C13513.513513513513%2C11111.111111111111&chco=FF0000%2C0000FF&chdl=JSON.parse%7CJsonPacket.unpack&chds=a&chxt=y%2Cx&chxl=1%3A%7Cstring%7Cint8%7Cuint8%7Cint16%7Cuint16%7Cint32%7Cuint32%7Cfloat%7Cdouble&chbh=a%2C4%2C23&chdlp=b%7Cl&chs=600x400)
