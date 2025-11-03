export function setupSockets(io) {
  io.on('connection', (socket) => {
    socket.on('join', ({ userId }) => {
      if (userId) socket.join(`user:${userId}`);
    });
    socket.on('watch-issue', ({ issueId }) => {
      if (issueId) socket.join(`issue:${issueId}`);
    });
    socket.on('join-admin', () => {
      socket.join('admins');
    });
  });
}


