const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const cors = require('cors');
const faker = require('faker');
const multer = require('multer');
const cloudinary = require('cloudinary');
const fs = require('fs');

const port = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const upload = multer({ dest: 'uploads/' });

app.use(cors());
const fritters = [];

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

app.post('/messages/upload', upload.single('image'), (req, res) => {
	cloudinary.uploader.upload(req.file.path, (result) => {
		const fileParts = result.secure_url.split('upload');
		const low_quality_url = `${fileParts[0]}upload/q_10/w_400/h_400/e_blur:300${fileParts[1]}`;
		const high_quality_url = `${fileParts[0]}upload/q_10/w_400/h_400${fileParts[1]}`;
		const newFritter = { low_quality_url, high_quality_url, message: req.body.message, datetime: Date.now() };
		fritters.push(newFritter);
		broadcast(newFritter);
		res.sendStatus(201);
		fs.unlink(req.file.path, (err) => {});
	});
});

app.get('/messages', (req, res) => {
	const offset = req.query.offset ? parseInt(req.query.offset) : 0;
	const size = req.query.size ? parseInt(req.query.size) : 30;
	const frittersResponse = [ ...fritters ].reverse().slice(offset, size + offset);

	res.json({
		posts: frittersResponse,
		total: fritters.length
	});
});

server.listen(process.env.PORT || 5001, () => {
	console.log(`Server started on port ${server.address().port}`);
});
