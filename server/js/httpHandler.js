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
  if (req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
    next()
  }
  if (req.method === 'GET') {
    if (req.url === '/') {
      res.writeHead(200, headers);
      res.end(messageQueue.dequeue());
      next()
    }
    if (req.url === '/background.jpg') {

      fs.readFile(module.exports.backgroundImageFile, (error, data) => {
        if (error) {
          console.log('error')
          res.writeHead(404, headers);
          res.end();
          next()
        } else {
          res.writeHead(200, headers);
          res.end(data);
          next()
        }

      })
    }
  }

};

  // fs.access(req.url, fs.constants.F_OK, function (error) {
  //   if (error) {
  //     res.writeHead(404, headers);
  //     res.end();
  //     console.log('file not found');
  //   } else {
  //     res.writeHead(200, headers);
  //     if (req.method === 'GET') {
  //       res.end(messageQueue.dequeue());
  //     } else {
  //       res.end();
  //     }
  //   }
  //   console.log('file found');

  // invoke next() at the end of a request to help with testing!
