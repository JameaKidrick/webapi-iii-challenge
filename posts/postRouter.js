const express = require('express');
const db = require('./postDb') // import post db
// MAY NEED TO IMPORT USERDB
const router = express.Router();

// custom middleware
// Verify post:
  // missing body = status 400 and message = "missing post data"
  // missing text field = status 400 and message = "missing required text field"
  const validatePostId = (req, res, next) => {
    const text = req.body.text;
    if(text === undefined){
      return res.status(400).json({ error:"missing post data" })
    }else if(text === ''){
      return res.status(400).json({ error:"missing required text field" })
    }
    next()
  };

  router.use(validatePostId)

// Get all posts
router.get('/', (req, res) => {
  db.get()
    .then(posts => {
      res.status(200).json(posts)
    })
});

// Get specific post
router.get('/:id', (req, res) => {
  db.getById(req.params.id)
    .then(post => {
      if(!post){
        res.status(404).json({ error:"This post doesn't exist" })
      }else{
        res.status(200).json(post)
      }
    })
});

// Delete specific post
router.delete('/:id', (req, res) => {
  db.getById(req.params.id)
  .then(post => {
    if(!post){
      res.status(404).json({ error:"This post doesn't exist" })
    }else{
      db.remove(post.id)
      .then(deletedPost => {
        res.status(200).json({ post })
      })
    }
  })
});

// Update specific post
router.put('/:id', validatePostId, (req, res) => {
  const changes = req.body;
  db.update(req.params.id, changes)
    .then(post => {
      if(!post){
        res.status(404).json( error="This post doesn't exist" )
      }else{
        db.getById(req.params.id)
          .then(updatedPost => {
            res.status(200).json({ updatedPost })
          })
      }
    })
});



module.exports = router;