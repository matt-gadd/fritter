import * as WebSocket from 'ws';
import * as http from 'http';
import * as express from 'express';
import * as cors from 'cors';
import * as multer from 'multer';
import * as fs from 'fs';
const cloudinary = require('cloudinary');

const port = process.env.PORT || 5001;
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const upload = multer({ dest: 'uploads/' });

interface Fritter {
	id: string;
	low_quality_url: string;
	high_quality_url: string;
	message: string;
	favCount: number;
	datetime: number;
}

app.use(cors());
const fritters: Fritter[] = [];

function createFritter(id: string, message: string, highQualityUrl: string, favCount = 0): Fritter {
	const fileParts = highQualityUrl.split('upload');
	const lowQualityUrl = `${fileParts[0]}upload/q_15,e_blur:300${fileParts[1]}`;
	const fritter = {
		id,
		low_quality_url: lowQualityUrl,
		high_quality_url: highQualityUrl,
		message,
		favCount,
		datetime: Date.now()
	};
	return fritter;
}

async function buildFritters(): Promise<void> {
	const result = await cloudinary.v2.search
		.expression('folder=default_dogs')
		.sort_by('public_id')
		.max_results(30)
		.execute();
	for (let i = 0; i < 500; i++) {
		const index = Math.floor(Math.random() * result.resources.length);
		const image = result.resources[index];
		const favCount = Math.floor(Math.random() * 20);
		const message = 'OMG check this doggy out!';
		const fritter = createFritter(`${i}`, message, image.secure_url, favCount);
		fritters.push(fritter);
	}
}

async function startup() {
	await buildFritters();

	function broadcast(data: Fritter) {
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
		cloudinary.v2.uploader.upload(
			req.file.path,
			{ format: 'jpg', width: 580, height: 400, crop: 'fill' },
			(error: Error, result: any) => {
				if (error) {
					return res.sendStatus(500);
				}
				const fritter = createFritter(req.body.id, req.body.message, result.secure_url);
				fritters.push(fritter);
				broadcast(fritter);
				res.sendStatus(201);
				fs.unlink(req.file.path, (err) => {});
			}
		);
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
		const offset = req.query.offset ? parseInt(req.query.offset, 10) : 0;
		const size = req.query.size ? parseInt(req.query.size, 10) : 5;
		const frittersResponse = [...fritters].reverse().slice(offset, size + offset);

		res.json({
			posts: frittersResponse,
			total: fritters.length
		});
	});

	server.listen(port, () => {
		console.log(`Server started on port ${port}`);
	});
}

startup();
