import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { SERVER_ADDR } from '@env'
import { io } from 'socket.io-client'

const AppContext = React.createContext()

const socket = io(SERVER_ADDR)

export const AppProvider = ({ children }) => {
  const navigation = useNavigation()
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
  const [activeSessionId, setActiveSessionId] = useState(null)

  const [location, setLocation] = useState(null)
  const [deals, setDeals] = useState([])
  const dealsRef = useRef([])
  dealsRef.current = deals

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
    dealsRef,
    setDeals,
    createdSession,
    setCreatedSession,
    joinedSession,
    joinedSessionRef,
    setJoinedSession,
    activeSessionId,
    getMyActiveSessions,
  }

  function getMyActiveSessions() {
    socket.emit('findMyActiveSessions', { name: userName.current }, (sessionId) => {
      setActiveSessionId(sessionId)
    })
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

    socket.on('trackingStarted', () => {
      navigation.navigate('TrackGameScreen', { loading: true })
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
