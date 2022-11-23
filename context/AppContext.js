import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const AppContext = React.createContext()

const SERVER_ADDR = 'http://192.168.8.190:8020'
const socket = io(SERVER_ADDR)

export const AppProvider = ({ children }) => {
    // const socket = useRef(null)

    const [players, setPlayers] = useState([])
    const [userName, setUserName] = useState('')
    const [serverState, setServerState] = useState('Loading Websocket...')
    const [session, setSession] = useState(null)
    const [location, setLocation] = useState(null)

    const providers = {
        socket,
        userName,
        setUserName,
        players,
        setPlayers,
        serverState,
        setServerState,
        session,
        setSession,
        location,
        setLocation,
    }

    useEffect(() => {
        socket.on('connect', () => {
            setServerState('Connected to Websocket')
        })

        socket.on('disconnect', () => {
            setServerState('Disconnected from Websocket')
        })

        return () => {
            socket.disconnect()
        }
    }, [socket])

    return <AppContext.Provider value={providers}>{children}</AppContext.Provider>
}

export default AppContext
