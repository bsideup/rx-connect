let adapter = require("./rx4Adapter");

export default {
    get: () => adapter,
    set: (newAdapter) => adapter = newAdapter,
}
