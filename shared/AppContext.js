import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const AppContext = React.createContext()

export const SERVER_ADDR = 'http://192.168.0.11:8020'
const socket = io(SERVER_ADDR)

export const AppProvider = ({ children }) => {
  const [players, setPlayers] = useState([])
  const [user, setUser] = useState(null)
  const [userName, setUserName] = useState('')
  const [serverState, setServerState] = useState('Loading Websocket...')
  const [session, setSession] = useState(null)
  const [location, setLocation] = useState(null)

  const providers = {
    socket,
    user,
    setUser,
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

    socket.on('message', (message) => {
      console.log('Websocket message: ', message)
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
