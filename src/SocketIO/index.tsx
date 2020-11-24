import io from 'socket.io-client';

import { API_BASE } from '../Configs'  

export const playerIO = io(`${API_BASE}/player`, { path: '/webgame/socket.io/'})
export const chatIO = io(`${API_BASE}/chat`, { path: '/webgame/socket.io/' })
export const gameIO = io(`${API_BASE}/game`, { path: '/webgame/socket.io/' })

export const vars = {
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
    },
    location: {
        name: undefined,
        image: undefined,
        position: {
            i: undefined,
            j: undefined,
        }
    },
    interaction: {
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
    ROUND_TIMEOUT: undefined
}