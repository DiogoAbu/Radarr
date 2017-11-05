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
import TYPE from './wantedMissing.type'
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
 * @param  {[type]} getParams [description]
 * @return {[type]}           [description]
 */
export function sync({ server, getParams, onDoneRead, onDoneGet, onDoneStore }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const { payload: stored, type: typeStored } = await read({ server, onDone: onDoneRead })(dispatch)
      const { payload: fetched, type: typeFetched } = await get({ server, onDone: onDoneGet, params: getParams })(dispatch)

      if (TYPE.hasOwnProperty(typeStored) && TYPE.hasOwnProperty(typeFetched) && !isEqual(stored, fetched)) {
        await store({ server, wantedMissingArray: fetched, onDone: onDoneStore })(dispatch)
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

      const value = await AsyncStorage.getItem(`${config.storageKey.wantedMissing}${server.key}`)
      const data = JSON.parse(value)
      const wantedMissingArray = typechecker.isArray(data) ? data : []

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_WANTEDMISSING, payload: wantedMissingArray })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [get description]
 * @param  {[type]} server Server
 * @param  {[type]} params Params
 * @return {[type]}        [description]
 */
export function get({ server, params, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const defaultParams = {
        sortKey : 'inCinemas',
        page    : 1,
        pageSize: config.wantedGetPageSize,
        sortDir : 'asc',
      }

      // Build URL
      const url = apiURL(server, 'wanted/missing', { ...defaultParams, ...params })
      const options = { method: 'GET', headers: apiHeaders(server), timeout: config.timeout }

      // Fetch from server
      const response = await fetch(url, options)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(`Error fetching wantedMissing at ${url} (${err.message})`)
      }

      // Check response
      const json = await response.json()
      const wantedMissingData = isValidJson(json) && json
      const { records } = wantedMissingData

      // It's an array, set it
      if (typechecker.isArray(records)) {
        if (typeof onDone === 'function') onDone()
        return dispatch({ type: TYPE.SET_WANTEDMISSING, payload: records })
      }

      throw new Error(`Failed to handle fetched wantedMissing data (${url})`)
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [store description]
 * @param  {[type]} server     Server
 * @param  {[type]} wantedMissingArray [description]
 * @return {[type]}
 */
export function store({ server, wantedMissingArray, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      if (!typechecker.isArray(wantedMissingArray)) {
        throw new Error('Failed to set/store wanted/missing, it must be an array')
      }

      await AsyncStorage.setItem(`${config.storageKey.wantedMissing}${server.key}`, JSON.stringify(wantedMissingArray))

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_WANTEDMISSING, payload: wantedMissingArray })
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

      await AsyncStorage.removeItem(`${config.storageKey.wantedMissing}${server.key}`)

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_WANTEDMISSING, payload: [] })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}
