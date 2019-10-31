/******************************** ROUTER SETUP ********************************/
const express = require('express');
const db = require('./postDb') // import post db
// MAY NEED TO IMPORT USERDB
const router = express.Router();

/******************************** CUSTOM MIDDLEWARE ********************************/
  // Verify post data (make sure it's there and information is given instead of empty array)
  const validatePost = (req, res, next) => {
    const text = req.body.text;
    if(text === undefined){
      return res.status(400).json({ error:"missing post data" })
    }else if(text === ''){
      return res.status(400).json({ error:"missing required text field" })
    }
    next()
  };

  const validatePostId = (req, res, next) => {
    const id = req.params.id;
    db.getById(id)
      .then(post => {
        if(!post){
          res.status(404).json({ error:"there is no post with that id" })
        }else{
          next()
        }
      })
  }

  // router.use(validatePostId) //ONLY USE IF IT WILL BE USED BY *ALL* REQUESTS

  /******************************** REQUEST HANDLERS ********************************/
// Get all posts
router.get('/', (req, res) => {
  db.get()
    .then(posts => {
      res.status(200).json(posts)
    })
    .catch(err => {
      res.status(500).json({ error:"can not retrieve posts" })
    })
});

// Get specific post
router.get('/:id', validatePostId, (req, res) => {
  const id = req.params.id;
  const post = req.body;
  post.user_id = id;
  db.getById(req.params.id)
    .then(post => {
      res.status(200).json(post)
    })
    .catch(err => {
      res.status(500).json({ error:"can not retrieve post" })
    })
});

// Delete specific post
router.delete('/:id', validatePostId, (req, res) => {
  db.getById(req.params.id)
  .then(post => {
    db.remove(post.id)
    .then(deletedPost => {
      res.status(200).json({ post })
    })
    .catch(err => {
      res.status(500).json({ error:"can not delete post" })
    })
  })
});

// Update specific post
router.put('/:id', [validatePost, validatePostId], (req, res) => {
  const changes = req.body;
  db.update(req.params.id, changes)
    .then(post => {
      db.getById(req.params.id)
        .then(updatedPost => {
          res.status(200).json({ updatedPost })
        })
    })
    .catch(err => {
      res.status(500).json({ error:"can not update post" })
    })
});

module.exports = router;