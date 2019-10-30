console.log('=== RUNNING ROUTER ===') // confirming router is running
/******************************** ROUTER SETUP ********************************/
const express = require('express');
// IMPORT USERDB
// MADE NEED TO IMPORT POSTDB
const router = express.Router();

/******************************** REQUEST HANDLERS ********************************/
router.post('/', (req, res) => {

});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {

});

router.get('/:id', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {

};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
