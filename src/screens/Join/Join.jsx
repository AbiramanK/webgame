import React from 'react'
import { withRouter } from 'react-router-dom'
import { Card, Input, Button, Form } from 'antd'

import styles from './Join.module.css'
import { Colors } from '../../Colors'
import { Header } from '../../components'
import { playerIO, vars, chatIO, gameIO } from '../../SocketIO'

export class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            joinClicked: false
        } 
    }

    componentDidMount() {
        playerIO.on('joinRes', data => {
            console.log('Join_playerIO_joinRes', data)

            if(!data.error) {
                vars.init = true
                vars.game = data.game
                vars.player = data.player
            
                chatIO.emit('join', { short_id: data.game.short_id })
            } else this.setState({ ...this.state, joinClicked: false })
        })
    
        chatIO.on('joinRes', data => {
            console.log('Join_chatIO_joinRes', data)

            if(!data.error) gameIO.emit('start', {
                short_id: vars.game.short_id,
                player_id: vars.player._id
            }) 
            else this.setState({ ...this.state, joinClicked: false })
        })

        gameIO.on('startRes', data => {
            console.log('Join_gameIO_startRes', data)

            this.setState({ ...this.state, joinClicked: false })
            if(!data.error) {
                if(vars.game.state === 'LOBBY') {
                    this.props.history.push(`/game-rooms/${vars.game.short_id}/lobby`)
                } else {
                    
                }
            }
        })
    }

    componentWillUnmount = () => {
        playerIO.off("joinRes")
        chatIO.off('joinRes')
        gameIO.off('startRes')
        this.setState = () => {}
    }

    parseLocations = tiles => {
        const parsedLocations = new Array(tiles.rows).fill(undefined).map(() => new Array(tiles.columns).fill(undefined))
        tiles.locations.forEach(location => {
            parsedLocations[location.position.i][location.position.j] = {
                name: location.name,
                image: location.image
            }
        })
        return parsedLocations
    }

    parseTempGuesses = (tiles, tempGuesses) => {
        const parsedGuesses = new Array(tiles.rows).fill(undefined).map(() => new Array(tiles.columns).fill(undefined))
        tempGuesses.forEach(guess => { parsedGuesses[guess.position.i][guess.position.j] = guess })
        return parsedGuesses
    }

    join = values => {
        if(!this.state.joinClicked) {
            playerIO.emit('join', { 
                ...values, 
                short_id: this.props.match.params.short_id 
            })
            this.setState({ ...this.state, joinClicked: true})
        }
    }

    render() {
        return (
            <div className={ styles['container'] }>
                <Header/>
                <div className={ styles['card-wrapper'] }>
                    <Card
                        className={ styles['birthmap-card'] }
                        title="Birthmap"
                        bordered={true}
                        style={{ width: 350, paddingTop: 0, paddingBottom: 0 }}
                        headStyle={{ ...jsxStyles.cardHeader }}
                    >
                        <Form layout="vertical" onFinish={ this.join }>
                            <Form.Item label="Name" name="name" className={ styles['input-label'] }><Input/></Form.Item>
                            <Form.Item label="Email" name="email" className={ styles['input-label'] }><Input/></Form.Item>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                className={ styles['submit-button'] }
                            >
                                Join
                            </Button>
                        </Form>
                    </Card>
               </div> 
            </div>
        )
    }
}

const jsxStyles = {
    cardHeader: {
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        color: Colors.WHITE,
        backgroundColor: Colors.PRIMARY,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    }
}

export default withRouter(Login);