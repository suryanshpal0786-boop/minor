let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`🔌 [Socket.io] Client connected: ${socket.id}`);

    // Join room for specific scan if needed
    socket.on('join_scan_room', (roomId) => {
      socket.join(roomId);
    });

    socket.on('disconnect', () => {
      // Disconnected
    });
  });
};

export const getIO = () => ioInstance;
