require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const config = require('./config');

mongoose.connect(config.mongo_uri, {useNewUrlParser: true}, () => {
  console.log(mongoose.connection.readyState)
});

// Basic Configuration
const port = config.port|| 3000;
const Url = require('./models/url.js').Url

app.use(cors());
app.use(express.urlencoded());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  let regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if(regexp.test(req.body.url)){
    Url.find((err, urls) => {
      urls = urls.map(url => url.short_url).sort()
      let index = urls.length === 0? 1: urls[urls.length - 1] 
  
      const new_url = new Url({original_url: req.body.url, short_url: index + 1})
      new_url.save(function (err) {
        if (err) return console.error(err);
        // saved!
      })
      res.json(new_url)
    })
  }
  else{
    res.json({ error: 'invalid url' })
  }
})

app.get('/api/shorturl/:id?', (req, res) => {
  let id = req.params.id
  Url.findOne({short_url: id}, (err,url) => {
    res.redirect(url.original_url)
  })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
