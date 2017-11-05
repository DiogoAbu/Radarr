/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import { AsyncStorage } from 'react-native'

/////////////////
// Third-party //
/////////////////
import fetch from 'react-native-fetch-polyfill'
import typechecker from 'typechecker'
import isValidJson from 'is-valid-json'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import TYPE from './movie.type'
import TYPEAPP from '../app/app.type'
import { config } from 'src/constant'
import { apiHeaders, apiURL, isValidServer } from 'src/lib'

//////////
// Init //
//////////
/**
 * [sync description]
 * @param  {[type]} server    [description]
 * @param  {[type]} gotStored [description]
 * @return {[type]}           [description]
 */
export function sync({ server, onDoneRead, onDoneGet, onDoneStore }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const { payload: stored, type: typeStored } = await read({ server, onDone: onDoneRead })(dispatch)
      const { payload: fetched, type: typeFetched } = await get({ server, onDone: onDoneGet })(dispatch)

      if (TYPE.hasOwnProperty(typeStored) && TYPE.hasOwnProperty(typeFetched) && !isEqual(stored, fetched)) {
        const { payload: storedNew } = await store({ server, movie: fetched, onDone: onDoneStore })(dispatch)
        return storedNew
      } else {
        return fetched
      }
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [read description]
 * @param  {[type]} server Server
 * @return {[type]}
 */
export function read({ server, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const value = await AsyncStorage.getItem(`${config.storageKey.movie}${server.key}`)
      const data = JSON.parse(value)
      const movieArray = typechecker.isArray(data) ? data : []

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_MOVIE, payload: movieArray })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [get description]
 * @param  {[type]} server  Server
 * @param  {[type]} movieId [description]
 * @return {[type]}         [description]
 */
export function get({ server, movieId, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      // Build URL
      const id = typechecker.isNumber(movieId) ? `/${movieId}` : ''
      const url = apiURL(server, `movie${id}`)
      const options = { method: 'GET', headers: apiHeaders(server), timeout: config.timeout }

      // Fetch from server
      const response = await fetch(url, options)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(`Error fetching movie at ${url} (${err.message})`)
      }

      // Check response
      const json = await response.json()
      const movieData = isValidJson(json) && json

      // It's an array, set it
      if (typechecker.isArray(movieData)) {
        if (typeof onDone === 'function') onDone()
        return dispatch({ type: TYPE.SET_MOVIE, payload: movieData })
      }

      // An specific movie
      if (typechecker.isObject(movieData)) {
        // Get stored movie array
        const value = await AsyncStorage.getItem(`${config.storageKey.movie}${server.key}`)
        const data = JSON.parse(value)
        const movieArray = typechecker.isArray(data) ? data : []

        // Look for the fetched movie
        const index = movieArray.findIndex(movie => movie.id === movieData.id)

        if (index === -1) {
          // Add if not found
          movieArray.push(movieData)
        } else {
          // Replace if found
          movieArray[index] = movieData
        }

        if (typeof onDone === 'function') onDone()
        return dispatch({ type: TYPE.SET_MOVIE, payload: movieArray })
      }

      throw new Error(`Failed to handle fetched movie data (${url})`)
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [store description]
 * @param  {[type]} server Server
 * @param  {[type]} movie  [description]
 * @return {[type]}
 */
export function store({ server, movie, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      // Replace if array
      if (typechecker.isArray(movie)) {
        await AsyncStorage.setItem(`${config.storageKey.movie}${server.key}`, JSON.stringify(movie))
        return dispatch({ type: TYPE.SET_MOVIE, payload: movie })
      }

      // Get stored array and add/replace movie object
      const value = await AsyncStorage.getItem(`${config.storageKey.movie}${server.key}`)
      const data = JSON.parse(value)
      const movieArray = typechecker.isArray(data) ? data : []

      if (!movie.id) {
        throw new Error('Movie has no ID')
      }

      // Look for specific movie
      const index = movieArray.findIndex(each => each.id === movie.id)

      if (index === -1) {
        // Did not find the id, just add the movie
        movieArray.push(movie)
      } else {
        // If found, replace it's values
        movieArray[index] = movie
      }

      await AsyncStorage.setItem(`${config.storageKey.movie}${server.key}`, JSON.stringify(movieArray))

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_MOVIE, payload: movieArray })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [purge description]
 * @param  {[type]} server Server
 * @return {[type]}
 */
export function purge({ server, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      await AsyncStorage.removeItem(`${config.storageKey.movie}${server.key}`)

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_MOVIE, payload: [] })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}
