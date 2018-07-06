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

function createFritter(id, message, high_quality_url, favCount = 0) {
	const fileParts = high_quality_url.split('upload');
	const low_quality_url = `${fileParts[0]}upload/q_15,e_blur:300${fileParts[1]}`;
	const fritter = {
		id,
		low_quality_url,
		high_quality_url,
		message,
		favCount,
		datetime: Date.now()
	};
	return fritter;
}

async function buildFritters() {
	const result = await cloudinary.v2.search.expression('folder=default_dogs').sort_by('public_id').max_results(30).execute();
	for (let i = 0; i < 500; i++) {
		const index = Math.floor(Math.random() * result.resources.length);
		const image = result.resources[index];
		const favCount = Math.floor(Math.random() * 20);
		const message = 'OMG check this doggy out!';
		const fritter = createFritter(i, message, image.secure_url, favCount);
		fritters.push(fritter);
	}
}

async function startup() {
	await buildFritters();

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
		cloudinary.v2.uploader.upload(req.file.path, { format: 'jpg', width: 580, height: 400, crop: 'fill' }, (error, result) => {
			if (error) {
				return res.sendStatus(500);
			}
			const fileParts = result.secure_url.split('upload');
			const low_quality_url = `${fileParts[0]}upload/q_15,e_blur:300${fileParts[1]}`;
			const fritter = createFritter(req.body.id, req.body.message, result.secure_url);
			fritters.push(fritter);
			broadcast(fritter);
			res.sendStatus(201);
			fs.unlink(req.file.path, (err) => {});
		});
	});

	app.post('/messages/:id/fav', (req, res) => {
		const { id } = req.params;
		let hasFritter = false;
		for (let i = 0; i < fritters.length; i++) {
			if (`${fritters[i].id}` === id) {
				fritters[i].favCount++;
				hasFritter = true;
				break;
			}
		}
		if (hasFritter) {
			res.sendStatus(200);
		} else {
			res.sendStatus(404);
		}
	});

	app.get('/messages', (req, res) => {
		const offset = req.query.offset ? parseInt(req.query.offset) : 0;
		const size = req.query.size ? parseInt(req.query.size) : 5;
		const frittersResponse = [ ...fritters ].reverse().slice(offset, size + offset);

		res.json({
			posts: frittersResponse,
			total: fritters.length
		});
	});

	server.listen(process.env.PORT || 5001, () => {
		console.log(`Server started on port ${server.address().port}`);
	});
}

startup();
