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
  const db = connection.db('freeUsers');
  collection = db.collection('users');
})();

/////////freeUsers mission:

////manager options:
// DELETE all users(manager option)
app.delete('/users/reset', async (req, res) => {
  try {
    await collection.deleteMany({});
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});
// DELETE one user(manager option)
app.delete('/users/:id', async (req, res) => {
  try {
    await collection.deleteOne({fullName: req.params.id});
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});
//POST new user(manager option)
app.post('/users', async (req, res) => {
  const {firstName, lastName, fullName, age, password} = req.body;
  try {
    await collection.insertOne({firstName, lastName, fullName, age, password});
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});
//GET all users(manager option)
app.get('/users', async (req, res) => {
  try {
    res.send(await collection.find({}).toArray())
  } catch (e) {
    res.send(e);
  } 
});
// //GET spceific user(manager option)
app.get('/users/:id', async (req, res) => {
  try {
    res.send(await collection.findOne({ _id: +req.params.id}))
  } catch (e) {
    res.send(e);
  } 
});

////users options:
// //GET spceific user
app.get('/users/:id', async (req, res) => {
  try {
    res.send(await collection.findOne({ _id: +req.params.id}))
  } catch (e) {
    res.send(e);
  } 
});

// //Aharon-DELETE himself
app.delete('/users/Aharon', async (req, res) => {
  try {
    res.send(await collection.deleteOne({ firstName: 'Aharon'}))
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  } 
});

//Aharon POST new user
app.post('/users/Aharon', async (req, res) => {
  const {firstName, lastName, age, password} = req.body;
  try {
    await collection.insertOne({firstName, lastName, age, password});
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});

// //Aharon PUT himself
app.put('/users/Aharon', async (req, res) => {
  try {
    const {firstName, lastName, age, password} = req.body;
    await collection.updateOne(
      { firstName: 'Aharon' },{ $set: {firstName, lastName, age, password} }
    );
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});


app.listen(8000, () => {
  console.log('listening');
});