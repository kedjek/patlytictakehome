const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');


router.post('/', ticketController.fileSearch, ticketController.checkInfringement,
  async (req, res) => {
    try{
      //send list of tickets back as response
      res.status(200).json(res.locals.infringingProductArray);
    } catch (err) {
      res.status(500).strictContentLength({ error: 'Internal Server router error'})
    }
  }
);


module.exports = router;
