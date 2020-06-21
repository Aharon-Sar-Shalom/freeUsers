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


// DELETE all users
app.delete('/users/reset', async (req, res) => {
  try {
    await collection.deleteMany({});
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});
// DELETE one user
app.delete('/users/:id', async (req, res) => {
  try {
    await collection.deleteOne({fullName: req.params.id});
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});
//POST new user
app.post('/users', async (req, res) => {
  const {firstName, lastName, age, email, password} = req.body;
  try {
    await collection.insertOne({firstName, lastName, age, email, password});
    res.status(200).json('ok');
  } catch (e) {
    res.send(e);
  }
});
//GET all users
app.get('/users', async (req, res) => {
  try {
    res.send(await collection.find({}).toArray())
  } catch (e) {
    res.send(e);
  } 
});
// //GET spceific user
app.get('/users/:id', async (req, res) => {
  try {
    res.send(await collection.findOne({ _id: +req.params.id}))
  } catch (e) {
    res.send(e);
  } 
});


app.listen(8000, () => {
  console.log('listening');
});