var express = require('express');
var app = express();
var server = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(server);
var ss = require('socket.io-stream');

app.use(express.static(`${__dirname}/html`));

server.listen(8000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/html/indexmp3.html');
});


io.on('connection', function (socket) {

  socket.emit('start', { hello: 'worold' });

  socket.on('stream', function (data) {
    console.log(data);
    console.log('Vai emitir Evento');
    socket.emit('downTo', { hello: 'downTo' });
    var stream = ss.createStream();
    var filename = __dirname + '/penningen.mp3';
    ss(socket).emit('audio-stream', stream, { name: filename });
    fs.createReadStream(filename).pipe(stream);
  });

  socket.on('evento', function(data){
    console.log(data);
    var textoEnviado = data;
    socket.emit('downTo', {dadoenviado: data});
    io.sockets.emit('downTo', {dadoenviado: data});
  });

  socket.on('audio', function(data){
    
    console.log('bateu no audio');
    socket.broadcast.emit('audio-stream', data);

  });


});
