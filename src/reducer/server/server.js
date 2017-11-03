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
import TYPE from './server.type'

import { createReducer } from 'src/lib'

//////////
// Init //
//////////
const initialState = {
  list  : [],
  active: {},
}

const reducer = {
  [TYPE.SET_SERVER]: (state, { payload: list }) => ({
    ...state,
    list,
  }),

  [TYPE.SET_SERVER_ACTIVE]: (state, { payload: active }) => ({
    ...state,
    active,
  }),
}

export default filterActions(createReducer(initialState, reducer), Object.values(TYPE))
