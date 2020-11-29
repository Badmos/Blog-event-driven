const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if(type === 'PostCreated') {
        const { id, title} = data;
        posts[id] = {id, title, comments: []};
    }

    if(type === 'CommentCreated') {
        const { commentId, content, postId, status } = data;
        const post = posts[postId];
        post.comments.push({commentId, content, status});
        console.log(post.comments);
    }

    if(type === 'CommentUpdated') {
        console.log("Is comment Updaated inside here please?")
        const { commentId, content, postId, status } = data;
        const post = posts[postId];
       
        comment = post.comments.find(comment => {
            return comment.commentId = commentId
        });

        comment.status = status;
        comment.content = content;

        console.log(posts)
    }
}

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/events', (req, res) => {
    console.log(`Event of type ${req.body.type} received`);
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send({});
});

app.listen(4002, async () => {
    console.log('Listening on 4002');

    const res = await axios.get('http://event-bus-srv:4005/events');

    for(let event of res.data) {
        console.log(`processing event: ${event.type}`);

        handleEvent(event.type, event.data)
    }
});