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
import TYPE from './queue.type'

import { createReducer } from 'src/lib'

//////////
// Init //
//////////
const initialState = {
  list: [],
}

const reducer = {
  [TYPE.SET_QUEUE]: (state, { payload: list }) => ({
    list,
  }),
}

export default filterActions(createReducer(initialState, reducer), Object.values(TYPE))
