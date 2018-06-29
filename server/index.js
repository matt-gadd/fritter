const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const port = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(cors());
app.use(bodyParser.json());

// API
// {
//   username: string;
//   message: string;
//   datetime: number;
// }

const fritters = [];

for (let i = 0; i < 500; i++) {
	fritters.push({
		message: `I am message number ${i}`,
		datetime: 1,
		user: `User ${i}`
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
	const frittersResponse = fritters.slice(offset, size + offset);

	res.json(frittersResponse);
});

app.post('/messages', (req, res) => {
	const newFritter = req.body;
	if (!newFritter.message || !newFritter.user || !newFritter.datetime) {
		return res.sendStatus(500);
	}

	fritters.push(newFritter);
	broadcast(newFritter);
	res.sendStatus(201);
});

server.listen(process.env.PORT || 5001, () => {
	console.log(`Server started on port ${server.address().port}`);
});
