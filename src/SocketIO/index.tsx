import io from 'socket.io-client';

import { API_BASE } from '../Configs'  

export const playerIO = io(`${API_BASE}/player`, { path: '/webgame/socket.io/'})
export const chatIO = io(`${API_BASE}/chat`, { path: '/webgame/socket.io/' })
export const gameIO = io(`${API_BASE}/game`, { path: '/webgame/socket.io/' })

export const vars = {
    init: false,
    game: {
        _id: undefined,
        short_id: undefined,
        state: undefined,
        players: [
            {
                _id: undefined,
                socket_id: undefined,
                name: undefined,
                email: undefined,
                state: undefined,
                isHost: undefined,
                score: undefined
            }
        ],
        lobby: {
            chats: []
        },
    },
    player: {
        _id: undefined,
        socket_id: undefined,
        name: undefined,
        email: undefined,
        state: undefined,
        isHost: undefined,
        score: undefined,
        isImposter: undefined
    },
    round: {
        _id: undefined,
        name: undefined,
        state: undefined,
        tiles: {
            rows: undefined,
            columns: undefined,
            locations: [
                [
                    {
                        name: undefined,
                        image: undefined,
                        position: {
                            i: undefined,
                            j: undefined
                        }
                    }
                ]
            ]
        },
        interactions: [
            {
                _id: undefined,
                question: {
                    from: {
                        name: undefined,
                        email: undefined
                    },
                    to: {
                        name: undefined,
                        email: undefined
                    },
                    question: undefined
                },
                answer: undefined
            }
        ],
        leaderboardChats: [],
        endingAt: '',
        endedAt: ''
    },
    location: {
        name: undefined,
        image: undefined,
        position: {
            i: undefined,
            j: undefined,
        }
    },
    tempGuesses: [
        [
            {
                _id: undefined,
                type: undefined,
                position: {
                    i: undefined,
                    j: undefined
                }
            }
        ]
    ],
    interaction_id: undefined,
}