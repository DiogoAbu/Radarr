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
import TYPE from './MovieIndex.actionType'

import { createReducer } from 'src/lib'

//////////
// Init //
//////////
const initialState = {
  query      : '',
  currentPage: 1,
  sort       : { by: 'added', order: 'DESC' },
  activeId   : null,
}

const reducer = {
  [TYPE.SET_MOVIEINDEX_QUERY]: (state, { payload: query }) => ({
    ...state,
    query,
    currentPage: 1,
  }),

  [TYPE.SET_MOVIEINDEX_CURRENT_PAGE]: (state, { payload: currentPage }) => ({
    ...state,
    query      : '',
    currentPage: currentPage === 'next' ? state.currentPage + 1 : currentPage,
  }),

  [TYPE.SET_MOVIEINDEX_SORT]: (state, { payload: sort }) => ({
    ...state,
    query      : '',
    currentPage: 1,
    sort       : !sort ? state.sort : !sort.by ? { ...sort, by: 'added' } : !sort.order ? { ...sort, order: 'DESC' } : sort,
  }),

  [TYPE.SET_MOVIEINDEX_ACTIVE]: (state, { payload: activeId }) => ({
    ...state,
    activeId,
  }),
}

export default filterActions(createReducer(initialState, reducer), Object.values(TYPE))
