/**
 * Module dependencies.
 */

const koaBody = require('koa-body');
const Koa = require('koa');
const Router = require('koa-router')
const fs = require('fs');
const app = new Koa();
const os = require('os');
const path = require('path');
var shell = require('shelljs');

app.use(koaBody({
  //formidable:{uploadDir: os.tmpdir()},    //This is where the files would come
  multipart: true
  //urlencoded: true
}));

const upload = new Router({ prefix: '/upload' })
upload
.post('/', async (ctx, next) => {
    console.log(ctx)
    const file = ctx.request.body.files.file;
    /*
    const reader = fs.createReadStream(file.path);
    const stream = fs.createWriteStream(path.join(os.tmpdir(), 'arco-xxx.zip'));
    reader.pipe(stream);
    */
    ctx.body = 'Success!';
    // console.log('uploading %s -> %s', file.name, stream.path);
    console.log('uploading %s -> %s', file.name, file.path);

    // Run external tool synchronously
    if (shell.exec(`unzip -o ${file.path}`).code !== 0) {
      shell.echo('Error: Unzip failed');
      shell.exit(1);
    }
    shell.rm(file.path)
    await next();
})

app.use(upload.routes())
app.use(upload.allowedMethods())

const blah = function () {
  var body = [];
  req
    .on('data', chunk => {
        body.push(chunk);
        console.log('Chunk ', chunk);
        })
    .on('end', () => {
        body = Buffer.concat(body);
        fs.writeFileSync('newfile.jpg', body, null);
    });
  res.write("OK\n");
  res.end();
}
// listen

app.listen(3333);
console.log('listening on port 3333');
