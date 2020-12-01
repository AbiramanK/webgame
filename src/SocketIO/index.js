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
            chats: [
                {
                    name: undefined,
                    email: undefined,
                    message: undefined
                }
            ]
        }
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
        count: undefined,
        name: undefined,
        state: undefined,
        tiles: {
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
        leaderboardChats: [],
        meeting: {
            by: undefined,
            voted: undefined,
            for: undefined,
        },
        imposterWon: undefined,
        endingAt: undefined,
        endedAt: undefined
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
    location: {
        name: undefined,
        image: undefined,
    },
    tempGuesses: [
        [
            {
                _id: undefined,
                type: undefined,
            }
        ]
    ],
}