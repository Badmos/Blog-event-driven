const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    console.log(`Event of type ${req.body.type} received`);
    const { type, data }  = req.body;

    if(type === 'CommentCreated') {
        const status = data.content.toLowerCase().includes('fuck') ? 'rejected': 'approved';

        await axios.post('http://event-bus-srv:4005/events', {
		    type: 'CommentModerated',
		    data: {
			    commentId: data.commentId, content: data.content, postId: data.postId, status
		    }
        });
    };
    
    res.send({});
});

app.listen(4003, () => {
    console.log('Listening on 4003');
  });
  