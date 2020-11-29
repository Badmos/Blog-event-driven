const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
	console.log(commentsByPostId);
	res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
	const commentId = randomBytes(4).toString('hex');
	const { content } = req.body;

	const comments = commentsByPostId[req.params.id] || [];

	comments.push({ id: commentId, content, status: 'pending' });

	commentsByPostId[req.params.id] = comments;

	await axios.post('http://event-bus-srv:4005/events', {
		type: 'CommentCreated',
		data: {
			commentId, content, postId: req.params.id, status: 'pending'
		}
	});

	res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
	console.log(`Event of type ${req.body.type} received`);

	const { type, data } = req.body;
	if(type === 'CommentModerated') {
		const { postId, commentId, content, status } = data;
		const comments = commentsByPostId[postId];
		console.log(comments, "YOOOOOO!!!!")

		const comment = comments.find(comment => {
			return comment.id === commentId;
		});
		comment.status = status;

		console.log("Before axios posts to 40005 events")
		await axios.post('http://event-bus-srv:4005/events', {
			type: 'CommentUpdated',
			data: {
				commentId, content, postId, status
			}
		});

		console.log("After  axios posts to 4005 events")
	}

	
	res.send({});
})

app.listen(4001, () => {
	console.log('Listening on 4001');
});
