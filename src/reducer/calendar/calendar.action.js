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
import moment from 'moment'

////////////
// Custom //
////////////
import TYPE from './calendar.type'
import TYPEAPP from '../app/app.type'
import { config } from 'src/constant'
import { apiHeaders, apiURL, isValidServer } from 'src/lib'

//////////
// Init //
//////////
/**
 * [sync description]
 * @param  {[type]} server      [description]
 * @param  {[type]} getParams   [description]
 * @param  {[type]} onDoneRead  [description]
 * @param  {[type]} onDoneGet   [description]
 * @param  {[type]} onDoneStore [description]
 * @return {[type]}             [description]
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
        await store({ server, calendarArray: fetched, onDone: onDoneStore })(dispatch)
      }
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [read description]
 * @param  {[type]} server [description]
 * @param  {[type]} onDone [description]
 * @return {[type]}        [description]
 */
export function read({ server, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const value = await AsyncStorage.getItem(`${config.storageKey.calendar}${server.key}`)
      const data = JSON.parse(value)
      const calendarArray = typechecker.isArray(data) ? data : []

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_CALENDAR, payload: calendarArray })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [get description]
 * @param  {[type]} server [description]
 * @param  {[type]} params [description]
 * @param  {[type]} onDone [description]
 * @return {[type]}        [description]
 */
export function get({ server, params, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const paramsFinal = handleGetParams(params)

      // Build URL
      const url = apiURL(server, 'calendar', paramsFinal)
      const options = { method: 'GET', headers: apiHeaders(server), timeout: config.timeout }

      // Fetch from server
      const response = await fetch(url, options)
      if (!response.ok) {
        const err = await response.json()
        throw new Error(`Error fetching calendar at ${url} (${err.message})`)
      }

      // Check response
      const json = await response.json()
      const calendarData = isValidJson(json) && json

      // It's an array, set it
      if (typechecker.isArray(calendarData)) {
        if (typeof onDone === 'function') onDone()
        return dispatch({ type: TYPE.SET_CALENDAR, payload: calendarData })
      }

      throw new Error(`Failed to handle fetched calendar data (${url})`)
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [handleGetParams description]
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
function handleGetParams(params) {
  // Return default
  if (!params) {
    const start = moment()
    return {
      start: start.startOf('month').format('YYYY-MM-DD'),
      end  : start.endOf('month').format('YYYY-MM-DD'),
    }
  }

  // Return specified
  if (params.start && params.end) {
    return params
  }

  // Prepare start time
  let start

  if (params.month && params.year) {
    start = moment(`${params.year}-${params.month}`, 'YYYY-MM')
  } else if (params.month) {
    start = moment(params.month, 'MM')
  } else if (params.year) {
    start = moment(params.year, 'YYYY')
  } else {
    start = moment()
  }

  return {
    start: start.startOf('month').format('YYYY-MM-DD'),
    end  : start.endOf('month').format('YYYY-MM-DD'),
  }
}

/**
 * [store description]
 * @param  {[type]} server        [description]
 * @param  {[type]} calendarArray [description]
 * @param  {[type]} onDone        [description]
 * @return {[type]}               [description]
 */
export function store({ server, calendarArray, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      if (!typechecker.isArray(calendarArray)) {
        throw new Error('Failed to set/store calendar, it must be an array')
      }

      await AsyncStorage.setItem(`${config.storageKey.calendar}${server.key}`, JSON.stringify(calendarArray))

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_CALENDAR, payload: calendarArray })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [purge description]
 * @param  {[type]} server [description]
 * @param  {[type]} onDone [description]
 * @return {[type]}        [description]
 */
export function purge({ server, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      await AsyncStorage.removeItem(`${config.storageKey.calendar}${server.key}`)

      if (typeof onDone === 'function') onDone()

      return dispatch({ type: TYPE.SET_CALENDAR, payload: [] })
    } catch (err) {
      console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}
