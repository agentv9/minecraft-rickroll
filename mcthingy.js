const net = require("net")
const leb128 = require('leb128');
const fs = require("fs")
module.exports =  class mcthingy {
    
    response;

    constructor(port, response) {
        this.lyrics = ["Were no strangers to love",
"You know the rules and so do i",
"A full commitments what Im thinking of",
"You wouldnt get this from any other guy",

"I just wanna tell you how Im feeling",
"Gotta make you understand",

" never gonna give you up",
"Never gonna let you down",
"Never gonna run around and desert you",
"Never gonna make you cry",
"Never gonna say goodbye",
"Never gonna tell a lie and hurt you",

"Weve know each other for so long",
"Your hearts been aching",
"But youre too shy to say it",
"Inside we both know whats been going on",
"We know the game and were gonna play it",

"And if you ask me how Im feeling",
"Dont tell me youre too blind to see"]
        this.response = response;
        this.lyric = 0
        this.server = net.createServer(conn => this.connect(conn));
        this.server.listen(port);
    }

    connect(conn) {
        conn.on('data', data => this.data(conn, data));
    }

    data(conn, data) {
        console.log(data)
        if (data.equals(Buffer.from('0100', 'hex'))) {
            
            conn.write(this.formatResponse());
        } else if (data.subarray(1, 2).equals(Buffer.from('01', 'hex'))) {
            conn.write(this.formatPong(data.subarray(2)));
            conn.destroy();
        }
    }

    formatResponse() {
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
                "text": `${this.lyrics[this.lyric]}`
            },
            "favicon": `data:image/png;base64,${image}`
        };
        this.lyric++
        if(this.lyric == 19) this.lyric = 0
        const respBuffer = Buffer.from(JSON.stringify(response));
        const respLengthBuffer = leb128.signed.encode(respBuffer.length);
        const packetLengthBuffer = leb128.signed.encode(respBuffer.length + respLengthBuffer.length + 1);

        return Buffer.concat(
            [
                packetLengthBuffer,
                Buffer.from('00', 'hex'), 
                respLengthBuffer, 
                respBuffer
            ]
        );
    }

    formatPong(longBuffer) {
        const packetLengthBuffer = leb128.signed.encode(longBuffer.length + 1);

        return Buffer.concat(
            [
                packetLengthBuffer,
                Buffer.from('01', 'hex'),
                longBuffer
            ]
        );
    }
}