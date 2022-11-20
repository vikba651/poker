import React, { useState, useEffect } from "react";
import { io } from 'socket.io-client'


const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
    const SERVER_ADDR = 'http://192.168.86.28:8020'


    const [players, setPlayers] = useState([])
    const [userName, setUserName] = useState('')
    const [socket, setSocket] = useState(io(SERVER_ADDR))
    const [serverState, setServerState] = useState('Loading Websocket...')
    const [session, setSession] = useState(null)

    const providers = { userName, setUserName, players, setPlayers, socket, setSocket, serverState, setServerState, session, setSession }

    useEffect(() => {

        socket.on('connect', () => {
            setServerState('Connected to Websocket')
        })

        socket.on('disconnect', () => {
            setServerState('Disconnected from Websocket')
        })


    }, [socket])

    return (
        <AppContext.Provider value={providers}>
            {children}
        </AppContext.Provider>
    )

}

export default AppContext