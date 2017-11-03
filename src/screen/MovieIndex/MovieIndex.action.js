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
import TYPE from './MovieIndex.actionType'

//////////
// Init //
//////////
/**
 * [setMovieQuery description]
 * @param  {[type]} query [description]
 * @return {[type]}        [description]
 */
export function setMovieQuery(query) {
  return { type: TYPE.SET_MOVIEINDEX_QUERY, payload: query }
}

/**
 * [setMovieCurrentPage description]
 * @param  {[type]} currentPage [description]
 * @return {[type]}             [description]
 */
export function setMovieCurrentPage(currentPage) {
  return { type: TYPE.SET_MOVIEINDEX_CURRENT_PAGE, payload: currentPage }
}

/**
 * [setMovieSort description]
 * @param  {[type]} sort [description]
 * @return {[type]}             [description]
 */
export function setMovieSort(sort) {
  return { type: TYPE.SET_MOVIEINDEX_SORT, payload: sort }
}

/**
 * [setMovieActive description]
 * @param  {[type]} movieId [description]
 * @return {[type]}         [description]
 */
export function setMovieActive(movieId) {
  return { type: TYPE.SET_MOVIEINDEX_ACTIVE, payload: movieId }
}
