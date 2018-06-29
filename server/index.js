const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const faker = require('faker');

const port = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(cors());
app.use(bodyParser.json());

// API
// {
//   user: {
//     name: string;
//     avatar: string;
//   };
//   message: string;
//   datetime: number;
// }

const fritters = [];
const users = [];
for (let i = 0; i < 20; i++) {
	users.push({
		name: faker.internet.userName(),
		avatar: faker.internet.avatar()
	});
}

for (let i = 0; i < 500; i++) {
	const userIndex = Math.floor(Math.random() * 19);
	fritters.push({
		message: faker.lorem.paragraph(),
		datetime: Date.now(),
		user: users[userIndex]
	});
}

function broadcast(data) {
	wss.clients.forEach((client) => {
		if (client.readyState === WebSocket.OPEN) {
			client.send(JSON.stringify(data));
		}
	});
}

wss.on('connection', (ws, req) => {
	console.log('Websocket connected', req.connection.remoteAddress);
	ws.on('error', (error) => {
		console.log('web socket error', error);
	});

	ws.on('close', () => {
		console.log('Websocket closed', req.connection.remoteAddress);
	});
});

app.get('/messages', (req, res) => {
	const offset = req.query.offset ? parseInt(req.query.offset) : 0;
	const size = req.query.size ? parseInt(req.query.size) : 30;
	const frittersResponse = [ ...fritters ].reverse().slice(offset, size + offset);

	res.json(frittersResponse);
});

app.post('/messages', (req, res) => {
	const newFritter = req.body;
	if (!newFritter.message || !newFritter.user) {
		return res.sendStatus(500);
	}

	fritters.push({ ...newFritter, datetime: Date.now() });
	broadcast(newFritter);
	res.sendStatus(201);
});

server.listen(process.env.PORT || 5001, () => {
	console.log(`Server started on port ${server.address().port}`);
});
