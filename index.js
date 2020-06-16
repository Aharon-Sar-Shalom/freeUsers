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

//freeUsers mission:

//post new user
app.post('/users', async (req, res) => {
  const {firstName, lastName, age, password} = req.body;
  try {
    await collection.insertOne({firstName, lastName, age, password});
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});

//get all users(for manager)
app.get('/users', async (req, res) => {
  try {
    res.send(await collection.find({}).toArray())
  } catch (e) {
    res.send(e);
  } 
});

// //Aharon-GET himself
app.get('/users/Aharon', async (req, res) => {
  try {
    res.send(await collection.findOne({ firstName: 'Aharon'}))
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