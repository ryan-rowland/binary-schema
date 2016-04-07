# binary-schema
Blazing fast two-way serialization between JSON and binary. Creates a payload
smaller than JSON by using a shared schema, and performs faster than JSON.parse
and JSON.stringify.

### Supported Types
Currently these data types are supported: **[utf8, ascii, int8, uint8,
int16, uint16, int32, uint32, float, double]**

Planned to support: **[array, object, boolean, number]**

Values can be denoted as nullable by appending a question mark: `{ title: 'ascii?' }`
# Example Usage
```js
import BinarySchema from 'binary-schema';

const characterSchema = new BinarySchema({
  name: 'ascii',
  title: 'ascii?',
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

// binary === <Buffer 07 00 00 0d ac 00 04 6f 73 6f 6d 03 00>
// binary.length === 13

const json = characterSchema.unpack(binary);

// json === { class: 7, maxHp: 3500, name: 'osom', race: 3 }
// JSON.stringify(json).length === 47
```

# Unpacking from an offset
If you're interpreting packets, it may be useful to start reading from
an offset. For instance, the first byte may contain a UInt8 representing the
type of packet you're receiving.

```js
const schemas = {
  0x01: new BinarySchema({ direction: 'uint8' }), // Move
  0x02: new BinarySchema({ enemyId: 'ascii' })    // Attack
};

socket.on('data', (message) => {
  const commandId = message.readUInt8(0);
  const body = schemas[commandId](message, 1);
})
```

# API

```js
class BinarySchema {
  constructor(template) {
    // Compiles pack and unpack methods from the template.
  }

  pack(json, offset) {
    // Returns a new buffer containing the packed json.
    // If offset is specified, [offset] number of undesignated bytes will
    // precede the packed json (extending the length of the buffer).
  }

  unpack(buffer, offset) {
    // Returns the json unpacked from the passed buffer.
    // If offset is specified, unpack will begin reading from that offset.
  }
}
```

# Benchmarks

###pack
![pack vs stringify](https://chart.googleapis.com/chart?cht=bvg&chtt=Operations+per+second+in+thousands&chts=%2C%2C&chd=t%3A2659.574468085106%2C2857.1428571428573%2C2500%2C2673.7967914438505%2C2604.1666666666665%2C2604.1666666666665%2C2732.24043715847%2C1992.03187250996%2C507.0993914807302%2C494.0711462450593%7C3267.97385620915%2C3401.360544217687%2C3378.3783783783783%2C3311.2582781456954%2C3424.6575342465753%2C3472.222222222222%2C2941.176470588235%2C2958.579881656805%2C499.001996007984%2C1216.54501216545&chco=FF0000%2C0000FF&chdl=JSON.stringify%7CBinarySchema.pack&chds=a&chxt=y%2Cx&chxl=1%3A%7Cint8%7Cuint8%7Cint16%7Cuint16%7Cint32%7Cuint32%7Cfloat%7Cdouble%7Cutf8%7Cascii&chbh=a%2C4%2C23&chdlp=b%7Cl&chs=600x400)

###unpack
![unpack vs parse](https://chart.googleapis.com/chart?cht=bvg&chtt=Operations+per+second+in+thousands&chts=%2C%2C&chd=t%3A2747.252747252747%2C2958.579881656805%2C2793.2960893854747%2C2824.858757062147%2C2732.24043715847%2C2857.1428571428573%2C2873.5632183908046%2C1960.7843137254902%2C720.4610951008646%2C682.1282401091405%7C33333.333333333336%2C33333.333333333336%2C33333.333333333336%2C35714.28571428572%2C27777.777777777777%2C35714.28571428572%2C12500%2C10204.081632653062%2C3571.4285714285716%2C4201.680672268908&chco=FF0000%2C0000FF&chdl=JSON.parse%7CBinarySchema.unpack&chds=a&chxt=y%2Cx&chxl=1%3A%7Cint8%7Cuint8%7Cint16%7Cuint16%7Cint32%7Cuint32%7Cfloat%7Cdouble%7Cutf8%7Cascii&chbh=a%2C4%2C23&chdlp=b%7Cl&chs=600x400)
