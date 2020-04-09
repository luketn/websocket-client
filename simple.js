const WebSocket = require('ws');
const faker = require('faker');

let firstName = faker.name.firstName();
let lastName = faker.name.lastName();

let ws = new WebSocket('wss://stingray-test-app.superservice.com/websockets-sydney');
ws.on('open', function open() {
    ws.send(JSON.stringify({message: 'identify', username: `${firstName} ${lastName}`}));
});
ws.on('message', function incoming(data) {
    let messageData = JSON.parse(data);
    if (messageData.message === "text" && messageData.text.indexOf("Welcome") === 0) {
        console.log("Connection identified.");
    }
});
ws.on('close', () => {
    console.log(`Closed for ${firstName} ${lastName}.`);
});