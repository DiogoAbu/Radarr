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
import TYPE from './profile.type'
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
        await store({ server, profileArray: fetched, onDone: onDoneStore })(dispatch)
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

      const value = await AsyncStorage.getItem(`${config.storageKey.profile}${server.key}`)
      const data = JSON.parse(value)
      const profileArray = typechecker.isArray(data) ? data : []

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_PROFILE, payload: profileArray })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [get description]
 * @param  {[type]} server  Server
 * @param  {[type]} profileId [description]
 * @return {[type]}         [description]
 */
export function get({ server, profileId, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      // Build URL
      const id = typechecker.isNumber(profileId) ? `/${profileId}` : ''
      const url = apiURL(server, `profile${id}`)
      const options = { method: 'GET', headers: apiHeaders(server), timeout: config.timeout }

      // Fetch from server
      const response = await fetch(url, options)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(`Error fetching profile at ${url} (${err.message})`)
      }

      // Check response
      const json = await response.json()
      const profileData = isValidJson(json) && json

      // It's an array, set it
      if (typechecker.isArray(profileData)) {
        if (typeof onDone === 'function') onDone()
        return dispatch({ type: TYPE.SET_PROFILE, payload: profileData })
      }

      // An specific profile
      if (typechecker.isObject(profileData)) {
        // Get stored profile array
        const value = await AsyncStorage.getItem(`${config.storageKey.profile}${server.key}`)
        const data = JSON.parse(value)
        const profileArray = typechecker.isArray(data) ? data : []

        // Look for the fetched profile
        const index = profileArray.findIndex(profile => profile.id === profileData.id)

        if (index === -1) {
          // Add if not found
          profileArray.push(profileData)
        } else {
          // Replace if found
          profileArray[index] = profileData
        }

        if (typeof onDone === 'function') onDone()
        return dispatch({ type: TYPE.SET_PROFILE, payload: profileArray })
      }

      throw new Error(`Failed to handle fetched profile data (${url})`)
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [store description]
 * @param  {[type]} server     Server
 * @param  {[type]} profileArray [description]
 * @return {[type]}
 */
export function store({ server, profileArray, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      if (!typechecker.isArray(profileArray)) {
        throw new Error('Failed to set/store profile, it must be an array')
      }

      await AsyncStorage.setItem(`${config.storageKey.profile}${server.key}`, JSON.stringify(profileArray))

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_PROFILE, payload: profileArray })
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

      await AsyncStorage.removeItem(`${config.storageKey.profile}${server.key}`)

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_PROFILE, payload: [] })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}
