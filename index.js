const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userAuthRoute = require('./src/routes/UserAuthRoute')
const fieldRoute = require('./src/routes/FieldRoute');
const postRoute = require('./src/routes/PostRoute');

const mongo = require('./src/db/mongo');

const app = express();

const PORT = process.env.PORT || 5000




app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', urlencoded: true}));

app.use(cors({
    origin: '*',
    method: ['GET','HEAD', 'POST', 'UPDATE', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],   
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}))


mongo.on('error', console.error.bind(console, "Couldn't connect mongoDB to server"))
mongo.once('open', ()=> {
    console.log("Mongodb connected successfully")
})



app.get('/check', (req, res) => {
    res.send("Hey! 👋 Listening you on the backend")
})



app.use('/user', userAuthRoute);

app.use('/field', fieldRoute)

app.use('/post', postRoute);







app.listen(PORT, (req, res)=> {
    console.log(`listening on ${PORT}`);
})





