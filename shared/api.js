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

export const createPlayer = (name) => {
  return postRequest(`${SERVER_ADDR}/players/create`, { name })
}

export const getPlayer = async (name) => {
  return postRequest(`${SERVER_ADDR}/players/`, { name })
}
