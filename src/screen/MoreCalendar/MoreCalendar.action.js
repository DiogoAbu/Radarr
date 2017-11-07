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

////////////
// Custom //
////////////
import TYPE from './MoreCalendar.actionType'

//////////
// Init //
//////////
/**
 * [setCurrentMonth description]
 * @param  {[type]} currentMonth [description]
 * @return {[type]}             [description]
 */
export function setCurrentMonth(currentMonth) {
  return { type: TYPE.SET_MORECALENDAR_CURRENT_MONTH, payload: currentMonth }
}

/**
 * [setCurrentYear description]
 * @param  {[type]} currentYear [description]
 * @return {[type]}             [description]
 */
export function setCurrentYear(currentYear) {
  return { type: TYPE.SET_MORECALENDAR_CURRENT_YEAR, payload: currentYear }
}
