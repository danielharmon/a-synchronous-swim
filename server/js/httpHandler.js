const fs = require('fs');
const path = require('path');
const headers = require('./cors');
const multipart = require('./multipartUtils');


// Path for the background image ///////////////////////
module.exports.backgroundImageFile = path.join('.', 'background.jpg');
////////////////////////////////////////////////////////

let messageQueue = null;
module.exports.initialize = (queue) => {
  messageQueue = queue;
};


module.exports.router = (req, res, next = ()=>{}) => {
  console.log('Serving request type ' + req.method + ' for url ' + req.url);
//look at path
fs.access(req.url, function(error) {
  if (error) {
    res.writeHead(404, headers);
    res.end();
    console.log('file not found');
  } else {
    res.writeHead(200, headers);
    if (req.method === 'GET') {
      res.end(messageQueue.dequeue());
    } else {
      res.end();
    }
    console.log('file found');
});
  next(); // invoke next() at the end of a request to help with testing!
};
