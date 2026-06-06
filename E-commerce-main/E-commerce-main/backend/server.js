const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Attach Socket.io
const io = socketIo(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('joinRoom', ({ userId, vendorId }) => {
    socket.join(`${userId}_${vendorId}`);
  });
  socket.on('sendMessage', (msg) => {
    io.to(msg.room).emit('receiveMessage', msg);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});