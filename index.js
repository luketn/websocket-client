const WebSocket = require('ws');
const faker = require('faker');
const count = 200000;
const websockets = [];
let countMessages = 0;
let countConnections = 0;

function oneHundredWebSockets() {
    for (let i = 0; i < 100; i++) {
        let firstName = faker.name.firstName();
        let lastName = faker.name.lastName();

        let ws = new WebSocket('wss://stingray-test-app.superservice.com/websockets-sydney');
        ws.on('open', function open() {
            ws.send(JSON.stringify({message: 'identify', username: `${firstName} ${lastName}`}));
            countConnections++;
        });
        ws.on('message', function incoming(data) {
            let messageData = JSON.parse(data);
            if (messageData.message === "text" && messageData.text.indexOf("Welcome") === 0) {
                countMessages++;
            }
        });
        ws.on('close', () => {
            console.log(`Closed for ${firstName} ${lastName}.`);
        });
        websockets.push(ws);
    }
}

let nextBatch = countConnections + 100;
oneHundredWebSockets();
let interval = setInterval(()=>{
    if (countConnections >= nextBatch) {
        nextBatch = countConnections + 100;
        oneHundredWebSockets();
    }
    console.log(`Established ${countConnections} web sockets. Waiting for ${countConnections}/${nextBatch} new connections to be established (identified ${countMessages}/${countConnections}).`);

    if (countMessages >= count) {
        console.log(`Finished! Established ${countConnections} web sockets (identified ${countMessages}/${countConnections}).`);
        clearInterval(interval);
    }
}, 500);