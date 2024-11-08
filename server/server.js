const path = require ('path');
const express = require ('express');

require('dotenv').config();
const app = express();
const apiRouter = require('./routes/api');
const port = 3000;

// Handle parsing request body, cookies, url
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
  
// Statically serve everything in the dist folder on route '/'
app.use(express.static(path.join(__dirname, '../dist')));

// Api routing when receiving form data
app.use(`/check-infringement`, apiRouter);

/*catch-all route handler for any requests to an unknown route*/
app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

app.use((err, req, res, next) => {
    const defaultErr = {
      log: 'Express error handler caught unknown middleware error',
      status: 500,
      message: { err: 'An error occurred' },
    };
    const errorObj = Object.assign({}, defaultErr, err);
    console.log(errorObj.log);
    return res.status(errorObj.status).json(errorObj.message);
  });


/*starts the server*/
// module.exports = app;
module.exports = app.listen(port, () => {console.log (`Server listening on port: ${port}...`)});

  