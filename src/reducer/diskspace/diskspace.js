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
import TYPE from './diskspace.type'

import { createReducer } from 'src/lib'

//////////
// Init //
//////////
const initialState = {
  list: [],
}

const reducer = {
  [TYPE.SET_DISKSPACE]: (state, { payload: list }) => ({
    list,
  }),
}

export default filterActions(createReducer(initialState, reducer), Object.values(TYPE))
