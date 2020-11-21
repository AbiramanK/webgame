import io from 'socket.io-client';

import { API_BASE } from '../Configs'  

export const playerIO = io(`${API_BASE}/player`, { path: '/webgame/socket.io/'})
export const chatIO = io(`${API_BASE}/chat`, { path: '/webgame/socket.io/' })
export const gameIO = io(`${API_BASE}/game`, { path: '/webgame/socket.io/' })