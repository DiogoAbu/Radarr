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
import moment from 'moment'

////////////
// Custom //
////////////
import TYPE from './MoreCalendar.actionType'

import { createReducer } from 'src/lib'

//////////
// Init //
//////////
const now = moment.utc()

const initialState = {
  currentMonth: now.month(),
  currentYear : now.year(),
}

const reducer = {
  [TYPE.SET_MORECALENDAR_CURRENT_MONTH]: (state, { payload: currentMonth }) => ({
    ...state,
    currentMonth,
  }),

  [TYPE.SET_MORECALENDAR_CURRENT_YEAR]: (state, { payload: currentYear }) => ({
    ...state,
    currentYear,
  }),
}

export default filterActions(createReducer(initialState, reducer), Object.values(TYPE))
