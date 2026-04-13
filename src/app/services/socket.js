import { io } from 'socket.io-client';

export const initSocket = (token) => {
  return io('http://localhost:3000', {
    auth: { token },
  });
};
