import { SERVER_ADDR } from './AppContext'

const postRequest = async (url, body) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    if (res.status === 200) {
      return res.json()
    } else {
      console.log(`status=${res.status}, msg=${res.message} from request=${url} `)
    }
  } catch (err) {
    console.log('error', err)
  }
}

const getRequest = async (url) => {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status === 200) {
      return res.json()
    } else {
      console.log(`status=${res.status}, msg=${res.message} from request=${url} `)
    }
  } catch (err) {
    console.log('error', err)
  }
}

const delRequest = async (url) => {
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status === 200) {
      return res.json()
    } else {
      console.log(`status=${res.status}, msg=${res.message} from request=${url} `)
    }
  } catch (err) {
    console.log('error', err)
  }
}

export const createPlayer = (name) => {
  return postRequest(`${SERVER_ADDR}/players/create`, { name })
}

export const getPlayer = (name) => {
  return postRequest(`${SERVER_ADDR}/players/`, { name })
}

export const getRounds = (name) => {
  return postRequest(`${SERVER_ADDR}/players/rounds/`, { name })
}

export const getPlayerEarnings = (name) => {
  return postRequest(`${SERVER_ADDR}/players/earnings/`, { name })
}

export const getRound = (roundId) => {
  return getRequest(`${SERVER_ADDR}/rounds/${roundId}`)
}

export const getRoundSummary = (roundId) => {
  return getRequest(`${SERVER_ADDR}/rounds/roundSummary/${roundId}`)
}

export const postRoundEarnings = (roundId, earnings) => {
  return postRequest(`${SERVER_ADDR}/rounds/roundEarnings/${roundId}`, { earnings })
}

export const getDealWinProbabilities = (roundId, dealNumber) => {
  return getRequest(`${SERVER_ADDR}/rounds/dealWinProbabilities/${roundId}/${dealNumber}`)
}

export const deleteRound = (roundId, playerId) => {
  return delRequest(`${SERVER_ADDR}/rounds/${roundId}/${playerId}`)
}
