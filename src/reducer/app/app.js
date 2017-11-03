/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////

/////////////////
// Third-party //
/////////////////
import { filterActions } from 'redux-ignore'

////////////
// Custom //
////////////
import TYPE from './app.type'

import { config } from 'src/constant'
import { createReducer } from 'src/lib'

//////////
// Init //
//////////
const initialState = {
  currentLocale     : null,
  fullscreen        : false,
  hasNetworkActivity: false,
  notification      : {},
  notificationArray : [],
}

const reducer = {
  [TYPE.SET_CURRENT_LOCALE]: (state, { payload: currentLocale }) => ({
    ...state,
    currentLocale,
  }),

  [TYPE.SET_FULLSCREEN]: (state, { payload: fullscreen }) => ({
    ...state,
    fullscreen,
  }),

  [TYPE.SET_NETWORK_ACTIVITY]: (state, { payload: hasNetworkActivity }) => ({
    ...state,
    hasNetworkActivity,
  }),

  [TYPE.SET_NOTIFICATION]: (state, { payload: notification }) => ({
    ...state,
    notification,
    notificationArray: [ notification, ...state.notificationArray ].slice(0, config.notificationMaxToStore),
  }),

  [TYPE.REMOVE_NOTIFICATION]: state => ({
    ...state,
    notification: {},
  }),
}

export default filterActions(createReducer(initialState, reducer), Object.values(TYPE))
