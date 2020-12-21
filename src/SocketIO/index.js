import io from 'socket.io-client';
 
import { API_BASE } from '../Configs'  

export const playerIO = io(`${API_BASE}/player`, { path: '/webgame/socket.io/' })
export const chatIO = io(`${API_BASE}/chat`, { path: '/webgame/socket.io/' })
export const gameIO = io(`${API_BASE}/game`, { path: '/webgame/socket.io/' })

export const vars = {
    init: false,
    game: {
        _id: undefined, 
        shortId: undefined,
        state: undefined,
        players: [{
            _id: undefined,
            socket_id: undefined,
            name: undefined,
            email: undefined,
            state: undefined,
            isHost: undefined,
            score: undefined,
            createdAt: undefined,
            updatedAt: undefined
        }],
        lobbyChats: [{
            name: undefined,
            email: undefined,
            message: undefined
        }],
        createdAt: undefined,
        updatedAt: undefined
    },
    player: {
        _id: undefined,
        socketId: undefined,
        name: undefined,
        email: undefined,
        state: undefined,
        isHost: undefined,
        score: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        isImposter: undefined
    },
    round: {
        _id: undefined,
        count: undefined,
        name: undefined,
        state: undefined,
        tiles: {
            locations: [{
                _id: undefined,
                name: undefined,
                image: undefined
            }],
            current: undefined
        },
        nextAskee: {
            index: undefined,
            givenChanceAt: undefined,
            askedAt: undefined 
        },
        leaderboardChats: [{
            playerId: undefined,
            message: undefined
        }],
        meeting: {
            by: undefined,
            votes: [{
                from: undefined,
                to: undefined
            }],
            candidates: [ undefined ]
        },
        imposterWon: undefined,
        endingAt: undefined,
        endedAt: undefined,
    },
    interactions: {
        list: [{
            _id: undefined,
            question: {
                from: undefined,
                to: undefined,
                message: undefined
            },
            answer: undefined
        }],
        current: undefined 
    },
    tempGuesses: [ undefined ],
    initialize() {
        this.game = {
            _id: undefined, 
            shortId: undefined,
            state: undefined,
            players: [{
                _id: undefined,
                socket_id: undefined,
                name: undefined,
                email: undefined,
                state: undefined,
                isHost: undefined,
                score: undefined,
                createdAt: undefined,
                updatedAt: undefined
            }],
            lobbyChats: [{
                name: undefined,
                email: undefined,
                message: undefined
            }],
            createdAt: undefined,
            updatedAt: undefined
        }
        this.player = {
            _id: undefined,
            socketId: undefined,
            name: undefined,
            email: undefined,
            state: undefined,
            isHost: undefined,
            score: undefined,
            createdAt: undefined,
            updatedAt: undefined,
            isImposter: undefined
        }
        this.round = {
            _id: undefined,
            count: undefined,
            name: undefined,
            state: undefined,
            tiles: {
                locations: [{
                    _id: undefined,
                    name: undefined,
                    image: undefined
                }]
            },
            nextAskee: {
                index: undefined,
                givenChanceAt: undefined,
                askedAt: undefined
            },
            leaderboardChats: [{
                playerId: undefined,
                message: undefined
            }],
            meeting: {
                by: undefined,
                votes: [{
                    from: undefined,
                    to: undefined
                }],
                candidates: [ undefined ]
            },
            imposterWon: undefined,
            endingAt: undefined,
            endedAt: undefined,
        }
        this.interactions = {
            list: [{
                _id: undefined,
                question: {
                    from: undefined,
                    to: undefined,
                    question: undefined
                },
                answer: undefined
            }],
            current: undefined 
        }
        this.location = undefined
        this.tempGuesses = [{
            locationId: undefined,
            type: undefined,
        }]
    }
}