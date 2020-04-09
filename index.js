const WebSocket = require('ws');
const faker = require('faker');
const count = 400;
const websockets = [];
let countMessages;

function oneHundredWebSockets() {
    for (let i = 0; i < 100; i++) {
        let firstName = faker.name.firstName();
        let lastName = faker.name.lastName();

        let ws = new WebSocket('wss://stingray-test-app.superservice.com/websockets-sydney');
        ws.on('open', function open() {
            ws.send(JSON.stringify({message: 'identify', username: `${firstName} ${lastName}`}));
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

countMessages = 0;
oneHundredWebSockets();
let interval = setInterval(()=>{
    if (countMessages === 100) {
        countMessages = 0;
        oneHundredWebSockets();
    }
    console.log(`Established ${websockets.length} web sockets. Waiting for ${countMessages}/100 new connections to be established and identified.`);


    if (websockets.length >= count) {
        clearInterval(interval);
    }
}, 1000);

