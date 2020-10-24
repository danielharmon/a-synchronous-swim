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
      var data = messageQueue.dequeue()
      console.log('served swim command', data)

      res.writeHead(200, headers);
      res.end(data);
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
  if (req.method === 'POST') {
    var file = [];
    //var file = Buffer.alloc(0)
    req.on('data', (chunk) => {
      file.push(chunk);
      //file = Buffer.concat([file, chunk])
    }).on('end', () => {

      file = Buffer.concat(file)
      file = multipart.getFile(file);
      console.log(file)

      if (file.type === 'application/octet-stream') {
        file = multipart.getFile(file.data)
      }

      fs.writeFile(module.exports.backgroundImageFile, file.data, 'binary', (error) => {
        if (error) {
          res.writeHead(404, headers)
          res.end()
          next()
        } else {
          res.writeHead(201, headers)
          res.end(file.data)
          next()
        }
      })
    })
  }
};


