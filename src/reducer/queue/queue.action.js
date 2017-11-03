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
import TYPE from './queue.type'
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
        await store({ server, queueArray: fetched, onDone: onDoneStore })(dispatch)
      }
    } catch (err) {
      if (__DEV__) console.warn(err)
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

      const value = await AsyncStorage.getItem(`${config.storageKey.queue}${server.key}`)
      const data = JSON.parse(value)
      const queueArray = typechecker.isArray(data) ? data : []

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_QUEUE, payload: queueArray })
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [get description]
 * @param  {[type]} server  Server
 * @return {[type]}         [description]
 */
export function get({ server, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      // Build URL
      const url = apiURL(server, 'queue')
      const options = { method: 'GET', headers: apiHeaders(server), timeout: config.timeout }

      // Fetch from server
      const response = await fetch(url, options)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(`Error fetching queue at ${url} (${err.message})`)
      }

      // Check response
      const json = await response.json()
      const queueData = isValidJson(json) && json

      // It's an array, set it
      if (typechecker.isArray(queueData)) {
        if (typeof onDone === 'function') onDone()
        return dispatch({ type: TYPE.SET_QUEUE, payload: queueData })
      }

      throw new Error(`Failed to handle fetched queue data (${url})`)
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [store description]
 * @param  {[type]} server     Server
 * @param  {[type]} queueArray [description]
 * @return {[type]}
 */
export function store({ server, queueArray, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      if (!typechecker.isArray(queueArray)) {
        throw new Error('Failed to set/store queue, it must be an array')
      }

      await AsyncStorage.setItem(`${config.storageKey.queue}${server.key}`, JSON.stringify(queueArray))

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_QUEUE, payload: queueArray })
    } catch (err) {
      if (__DEV__) console.warn(err)
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

      await AsyncStorage.removeItem(`${config.storageKey.queue}${server.key}`)

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_QUEUE, payload: [] })
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [remove description]
 * @param  {[type]} server  Server
 * @param  {[type]} params  [description]
 * @return {[type]}         [description]
 */
export function remove({ server, params, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      if(!params || !params.id || !typechecker.isNumber(params.id)){
        throw new Error('Queue ID number is required')
      }

      const defaultParams = {
        blacklist: false,
      }

      // Build URL
      const url = apiURL(server, 'queue', { ...defaultParams, ...params })
      const options = { method: 'DELETE', headers: apiHeaders(server), timeout: config.timeout }

      // Fetch from server
      const response = await fetch(url, options)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(`Error remove item from queue at ${url} (${err.message})`)
      }

      const { payload: stored, type: typeStored } = await read({ server })(dispatch)

      if (!TYPE.hasOwnProperty(typeStored)){
        throw new Error('Failed to store queue')
      }

      const storedCopy = [ ...stored ]
      const index = storedCopy.findIndex(e => e.id === params.id)

      if(index === -1) {
        throw new Error('Failed to remove item from queue')
      }

      // Remove item
      storedCopy.splice(index, 1)

      await store({ server, queueArray: storedCopy, onDone })(dispatch)

      throw new Error(`Failed to handle fetched queue data (${url})`)
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}
