const mc = require("./mcthingy")
const fs = require("fs")


function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString('base64');
}

let image = base64_encode("server-icon.png")

const response = {
    "version": {
        "name": "1.12.2",
        "protocol": 335	
    },
    "players": {
        "max": 100,
        "online": 0
    },
    "description": {
        "text": "This is made by a script"
    },
    "favicon": `data:image/png;base64,${image}`
};

new mc(8080, response);