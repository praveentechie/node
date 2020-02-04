const express = require('express');
const userCollection = require('../db/collections/users-collection');
const User = require('../entity/user');

const router = express.Router()

router.use((req, res, next) => {
  // intercept the request
  console.log('request received for ' + req.originalUrl + ' @', Date.now());
  next();
});

router.post('/', (req, res) => {
  let user = new User(req.body.firstName, req.body.lastName);
  userCollection.create(user).then(response => {
    console.log('res', response);
    res.send(response);
  });
});

router.get('/', (req, res) => {
  userCollection.getAll().then(response => {
    console.log('res', response);
    res.send(response);
  });
});

router.get('/:userId', (req, res) => {
  userCollection.getById(req.params.userId).then(response => {
    console.log('resp', response);
    res.send(response);
  });
});

module.exports = router;