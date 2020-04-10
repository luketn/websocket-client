const SERVER_ADDRESS = 'wss://stingray-test-app.superservice.com/websockets-sydney';
const COUNT = 50000;

const WebSocket = require('ws');
const faker = require('faker');
const websockets = [];

let countMessages = 0;
let countConnections = 0;

function oneHundredWebSockets() {
    for (let i = 0; i < 100; i++) {
        let firstName = faker.name.firstName();
        let lastName = faker.name.lastName();

        let ws = new WebSocket(SERVER_ADDRESS);
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
        ws.on('error', (error)=>{
            console.log(`Error occurred for socket ${firstName} ${lastName}:\n${error}`);
            countConnections++;
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
    console.log(`Established ${countConnections}/${COUNT} web sockets. Waiting for next batch of 100 new connections to be established (identified ${countMessages}/${COUNT}).`);

    if (countMessages >= COUNT) {
        console.log(`Finished! Established ${countConnections} web sockets (identified ${countMessages}/${COUNT}).`);
        clearInterval(interval);
    }
}, 500);

let keep_alive_interval = setInterval(()=>{
    let countPinged = 0;
    let countClosed = 0;
    for (const websocket of websockets) {
        if (websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify({message: "ping"}));
            countPinged++;
        } else {
            countClosed++;
        }
    }
    console.log(`Pinged ${countPinged}/${COUNT} web sockets.`);

    if (countClosed===COUNT){
        console.log('All connections closed.');
        clearInterval(keep_alive_interval);
    }
}, 5 * 60 * 1000); //five minutes

