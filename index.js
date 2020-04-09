const WebSocket = require('ws');
const faker = require('faker');
const count= 500;
const websockets = [];

for (let i = 0; i < count; i++) {
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();

    let ws = new WebSocket('wss://stingray-test-app.superservice.com/websockets-sydney');
    ws.on('open', function open() {
        ws.send(JSON.stringify({message: 'identify', username: `${firstName} ${lastName}`}));
    });
    ws.on('message', function incoming(data) {
        console.log(data);
    });
    ws.on('close', ()=>{
        console.log(`Closed for ${firstName} ${lastName}.`);
    });
    websockets.push(ws);
}
