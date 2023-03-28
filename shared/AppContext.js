import React, { useState, useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const AppContext = React.createContext()

export const SERVER_ADDR = 'http://192.168.86.22:8020'
const socket = io(SERVER_ADDR)

export const AppProvider = ({ children }) => {
  const [players, setPlayers] = useState([])
  const [user, setUser] = useState({ name: 'No connection boy' })
  const userName = useRef('')
  userName.current = user.name
  const [serverState, setServerState] = useState('Loading Websocket...')
  const [createdSession, setCreatedSession] = useState(false)
  const [joinedSession, setJoinedSession] = useState(false)
  const joinedSessionRef = useRef(null)
  joinedSessionRef.current = joinedSession
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
    createdSession,
    setCreatedSession,
    joinedSession,
    joinedSessionRef,
    setJoinedSession,
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

    socket.on('sessionUpdated', (session) => {
      setSession(session)
    })

    socket.on('disconnect', () => {
      setServerState('Disconnected from Websocket')
    })

    return () => {
      console.log('unmount')
      socket.disconnect()
    }
  }, [socket])

  return <AppContext.Provider value={providers}>{children}</AppContext.Provider>
}

export default AppContext
