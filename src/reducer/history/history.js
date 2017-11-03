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
import TYPE from './history.type'

import { createReducer } from 'src/lib'

//////////
// Init //
//////////
const initialState = {
  page         : 0,
  pageSize     : 0,
  sortKey      : '',
  sortDirection: '',
  totalRecords : 0,
  records      : [],
}

const reducer = {
  [TYPE.SET_HISTORY]: (state, { payload }) => ({
    ...payload,
  }),
}

export default filterActions(createReducer(initialState, reducer), Object.values(TYPE))
