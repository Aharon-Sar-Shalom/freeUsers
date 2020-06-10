//packages for the program
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const mongo = require('mongodb');
const fetch = require('node-fetch');

//setup the connection for my development
let collection = null;
(async () => {
  const url = 'mongodb://localhost:27017';
  const connection = await mongo.connect(url, {useUnifiedTopology: true, useNewUrlParser: true});
  const db = connection.db('mydb');
  collection = db.collection('todos');
})();

//crud api with mongodb

//get all todos
app.get('/todos', async (req, res) => {
  try {
    res.send(await collection.find({}).toArray())
  } catch (e) {
    res.send(e);
  } 
});

//get specific todo
app.get('/todos/:id', async (req, res) => {
  try {
    res.send(await collection.findOne({ _id: +req.params.id}))
  } catch (e) {
    res.send(e);
  } 
});

//post to the end of the todo with order of numbers for _id
app.post('/todos', async (req, res) => {
  const { _id: maxId} = await collection
    .find({})
    .sort({ _id: -1 })
    .next();
  const {title, completed} = req.body;
  try {
    await collection.insertOne({ _id: maxId + 1, title, completed});
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});

//put todo
app.put('/todos/:id', async (req, res) => {
  try {
    const {title, completed} = req.body;
    await collection.updateOne(
      { _id: +req.params.id }, { $set: {title, completed} }
    );
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});

//delete on todo by the _id
app.delete('/todos/:id', async (req, res) => {
  try {
    await collection.deleteOne({ _id: +req.params.id });
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});

//reset all the todos and insert two todo for start
app.get('/resetDB', async (req, res) => {
  try {
    await collection.deleteMany({});
    const initialTodos = [
      {
        _id: 1,
        title: 'learning',
        completed: false
      },
      {
        _id: 2,
        title: 'smile',
        completed: false
      }
    ];
    await collection.insertMany(initialTodos);
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});


//tests with node-fetch(are the same mongodb/from file):
app.get('/testGet', async (req, res) => {
  try {
    const fetchResp = await fetch('http://localhost:8000/todos');
    const json = await fetchResp.json();
    res.send(json);
  } catch (e) {
    res.send(e);
  }
});

app.get('/testPost', async (req, res) => {
  try {
    const fetchResp = await fetch('http://localhost:8000/todos', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'content-type': 'application/json' 
      },
      body: JSON.stringify({
        title: 'check',
        completed: false
      })
    });
    const json = await fetchResp.json();
    res.send(json);
  } catch (e) {
    res.send(e);
  }
});


app.listen(8000, () => {
  console.log('listening');
});