# F1 Fantasy API

The [documentation is available here](https://zeroclutch.github.io/f1-fantasy-api/). The [Github is available here](https://github.com/zeroclutch/f1-fantasy-api). The [Discord is available here](https://discord.gg/bAMc7yNfnA).

### Get started

#### Install 
```
npm i f1-fantasy-api
```

Then, import and instantiate a [Client](https://zeroclutch.github.io/f1-fantasy-api/Client.html).

### Example

```js
const { Client } = require('f1-fantasy-api')

const client = new Client( /* options */ )
client.init()
.then(() => {
    console.log(client.drivers.get(15)) // Prints Charles Leclerc's information
})
```

### Help us out

This is all very much a work in progress, we'd love for you to join us and contribute! Join [the discord](https://discord.gg/bAMc7yNfnA) to learn more.
