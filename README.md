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
![pack vs stringify](https://chart.googleapis.com/chart?cht=bvg&chtt=Operations+per+second+in+thousands&chts=%2C%2C&chd=t%3A2747.252747252747%2C2717.391304347826%2C2645.5026455026455%2C2702.7027027027025%2C2577.319587628866%2C2564.102564102564%2C2702.7027027027025%2C1886.7924528301887%2C2659.574468085106%2C2564.102564102564%7C3184.7133757961783%2C3355.7046979865772%2C3424.6575342465753%2C3401.360544217687%2C3355.7046979865772%2C3401.360544217687%2C2777.777777777778%2C2958.579881656805%2C1457.725947521866%2C1336.8983957219252&chco=FF0000%2C0000FF&chdl=JSON.stringify%7CBinarySchema.pack&chds=a&chxt=y%2Cx&chxl=1%3A%7Cstring%7Cint8%7Cuint8%7Cint16%7Cuint16%7Cint32%7Cuint32%7Cfloat%7Cdouble&chbh=a%2C4%2C23&chdlp=b%7Cl&chs=600x400)

###unpack
![unpack vs parse](https://chart.googleapis.com/chart?cht=bvg&chtt=Operations+per+second+in+thousands&chts=%2C%2C&chd=t%3A2732.24043715847%2C2777.777777777778%2C2732.24043715847%2C2732.24043715847%2C2702.7027027027025%2C2732.24043715847%2C2732.24043715847%2C1984.126984126984%2C2590.6735751295337%2C2525.252525252525%7C35714.28571428572%2C38461.53846153846%2C41666.666666666664%2C35714.28571428572%2C35714.28571428572%2C38461.53846153846%2C12500%2C11363.636363636364%2C6756.756756756757%2C3846.153846153846&chco=FF0000%2C0000FF&chdl=JSON.parse%7CBinarySchema.unpack&chds=a&chxt=y%2Cx&chxl=1%3A%7Cstring%7Cint8%7Cuint8%7Cint16%7Cuint16%7Cint32%7Cuint32%7Cfloat%7Cdouble&chbh=a%2C4%2C23&chdlp=b%7Cl&chs=600x400)
