/**
 * Module dependencies.
 */
const fs = require('fs');
const os = require('os');
const archiver = require('archiver');
const request = require('request');

const push = function () {
  console.log("Archiving files in " + process.cwd());
  console.log('temp directory ' + os.tmpdir())
  const fileName = `${os.tmpdir()}/arco.zip`
  archive(fileName);
  // upload(fileName);
}
const archive = function (fileName) {
  var fileOutput = fs.createWriteStream(fileName);
  var archive = archiver('zip');
  
  fileOutput.on('close', function () {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
      upload(fileName);
  });
  
  archive.pipe(fileOutput);
  archive.glob("**/*", {
    ignore: ['node_modules/**', 'file.txt']
  });
  // archive.glob("../dist/.htaccess"); //another glob pattern
  // add as many as you like
  archive.on('error', function(err){
      throw err;
  });
  archive.finalize();
}

const upload = function (fileName) {
  // fs.createReadStream(fileName).pipe(request.post('http://localhost:3333'))
  const url = 'http://localhost:3333/upload';
  var req = request.post(url, function (err, resp, body) {
    if (err) {
      console.log('Error!');
    } else {
      console.log('URL: ' + body);
    }
  });
  var form = req.form();
  form.append('file', fs.createReadStream(fileName));
}

/*
const upload = function (fileName) {
  var formData = {
    // Pass a simple key-value pair
    my_field: 'my_value',
    // Pass data via Buffers
    my_buffer: new Buffer([1, 2, 3]),
    // Pass data via Streams
    my_file: fs.createReadStream(fileName),
    // Pass multiple values /w an Array
    attachments: [
      fs.createReadStream(__dirname + '/attachment1.jpg'),
      fs.createReadStream(__dirname + '/attachment2.jpg')
    ],
    // Pass optional meta-data with an 'options' object with style: {value: DATA, options: OPTIONS}
    // Use case: for some types of streams, you'll need to provide "file"-related information manually.
    // See the `form-data` README for more information about options: https://github.com/form-data/form-data
    custom_file: {
      value:  fs.createReadStream('/dev/urandom'),
      options: {
        filename: 'topsecret.jpg',
        contentType: 'image/jpeg'
      }
    }
  };
  request.post({url:'http://service.com/upload', formData: formData}, function optionalCallback(err, httpResponse, body) {
    if (err) {
      return console.error('upload failed:', err);
    }
    console.log('Upload successful!  Server responded with:', body);
  });
}
*/
const run = function () {
  const cmd = process.argv[2]
  console.log(cmd)
  switch(cmd) {
    case 'serve' :
      require('./server/app');
      break;
    case 'push' :
      push();
      break;
  }
}
module.exports.run = run;