console.log('=== RUNNING ROUTER ===') // confirming router is running
/******************************** ROUTER SETUP ********************************/
const express = require('express');
const db = require('./userDb'); // import user db
const postDB = require('../posts/postDb');
const router = express.Router();


/******************************** CUSTOM MIDDLEWARE ********************************/
// Verify user exists
function validateUserId(req, res, next) {
  const id = req.params.id;
  db.getById(id)
    .then(user => {
      if(!user){
        return res.status(400).json({ error: "invalid user id" })
      }else{
        next(); // added next() inside else to get rid of response error about sending response to header after client received one already
      }
    })
  
};

// Verify user info is there
function validateUser(req, res, next) {
  const name = req.body.name;
  if(name === undefined){
    res.status(400).json({ error:"missing user data" })
  }else if(name === ''){
    res.status(400).json({ error:"missing required name field" }) // ***TEST***
  }else{
    next();
  }
};

// Verify post info is there
function validatePost(req, res, next) {
  const text = req.body.text;
  if(text === undefined){
    return res.status(400).json({ error:"missing user data" })
  }else if(text === ''){
    return res.status(400).json({ error:"missing required text field" })
  }
  next();
};

/******************************** REQUEST HANDLERS ********************************/
// Create new user
router.post('/', validateUser, (req, res) => {
  const name = req.body
  db.get()
    .then(users => {
      if(users.map(item => { // logic checking for existing user
        return item.name === name.name ? true : false
      }).find(item => {
        return item === true
      })){
        res.status(400).json({ error:"a user with that username already exists in the database"})
      }else{
        db.insert(name)
          .then(user => {
            res.status(200).json(user)
          })
      }
    })
    .catch(err => {
      res.status(500).json({ error: "could not create new user" })
    })
});

// Add new post by specified user
router.post('/:id/posts', [validatePost, validateUserId], (req, res) => {
  const id = req.params.id;
  const post = req.body;
  post.user_id = id;
  db.getUserPosts(id)
    .then(posts => {
      postDB.insert(post)
        .then(newPost => {
          res.status(200).json(newPost)
        })
        .catch(err => {
          res.status(500).json({ error: "could not create new post" })
        })
    })
});

// Get all users
router.get('/', (req, res) => {
  db.get()
    .then(users => {
      res.status(200).json(users)
    })
    .catch(err => {
      res.status(500).json({ error: "could not retrieve users" })
    })
});

// Get specific user
router.get('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  db.getById(id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch(err => {
      res.status(500).json({ error: "could not retrieve user" })
    })
});

// Get the specified user's posts
router.get('/:id/posts', validateUserId, (req, res) => {
  db.getUserPosts(req.params.id)
    .then(posts => {
      if(!posts[0]){
        res.status(400).json({ error: "this user has no posts" })
      }else{
        res.status(200).json(posts)
      }
    })
    .catch(err => {
      res.status(500).json({ error: "could not retrieve user's posts" })
    })
});

// Delete a user
router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  db.getById(id)
    .then(deletedUser => {
        db.remove(id)
      .then(deleted => {
        res.status(200).json(deletedUser)
      })
    })
    .catch(err => {
      res.status(500).json({ error: "could not delete user" })
    })
});

// Update a user
router.put('/:id', [validateUserId, validateUser], (req, res) => {
  const id = req.params.id;
  const name = req.body
  db.update(id, name)
    .then(user => {
      db.getById(id)
        .then(userObj => {
          res.status(200).json(userObj)
        })
    })
    .catch(err => {
      res.status(500).json({ error: "could not update user" })
    })
});

module.exports = router;
