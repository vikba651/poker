import React, { useState, useEffect, useRef } from 'react'
import { AppState } from 'react-native'
import { io } from 'socket.io-client'

const AppContext = React.createContext()

export const SERVER_ADDR = 'http://192.168.0.11:8020'
const socket = io(SERVER_ADDR)

export const AppProvider = ({ children }) => {
  const appState = useRef(AppState.currentState)

  const [players, setPlayers] = useState([])
  const [user, setUser] = useState({ name: 'No connection boy' })
  const userName = useRef('')
  userName.current = user.name
  const [serverState, setServerState] = useState('Loading Websocket...')
  const [sessionCreatedByUser, setSessionCreatedByUser] = useState(false)
  const [session, setSession] = useState(null)
  const sessionRef = useRef(null)
  sessionRef.current = session

  const [location, setLocation] = useState(null)
  const [deals, setDeals] = useState([])

  const providers = {
    socket,
    user,
    setUser,
    players,
    setPlayers,
    serverState,
    setServerState,
    session,
    sessionRef,
    setSession,
    location,
    setLocation,
    deals,
    setDeals,
    sessionCreatedByUser,
    setSessionCreatedByUser,
  }

  useEffect(() => {
    socket.on('connect', () => {
      setServerState('Connected to Websocket')
      if (sessionRef.current) {
        socket.emit('rejoinSession', { name: userName.current, sessionId: sessionRef.current.id })
      }
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
