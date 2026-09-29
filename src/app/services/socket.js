import { io } from 'socket.io-client';
import { API_BASE_URL } from './api';

export const initSocket = (token) => {
  return io(API_BASE_URL, {
    auth: { token },
  });
};
