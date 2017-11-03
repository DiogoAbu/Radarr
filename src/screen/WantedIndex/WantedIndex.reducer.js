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
import TYPE from './WantedIndex.actionType'

import { createReducer } from 'src/lib'

//////////
// Init //
//////////
const initialState = {
  currentPage: 1,
}

const reducer = {
  [TYPE.SET_WANTEDINDEX_CURRENT_PAGE]: (state, { payload: currentPage }) => ({
    ...state,
    currentPage: currentPage === 'next' ? state.currentPage + 1 : currentPage,
  }),
}

export default filterActions(createReducer(initialState, reducer), Object.values(TYPE))
