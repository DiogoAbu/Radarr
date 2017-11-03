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
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import { config } from 'src/constant'

//////////
// Init //
//////////
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

const getQueueList = state => state.queue.list
const getCurrentPage = state => state.QueueIndex.currentPage

const getQueueArray = createDeepEqualSelector(getQueueList, movieList => {
  return movieList
  // Reduce movie data
  /*return movieList.map(movie => ({
    downloaded : movie.downloaded,
    genres     : movie.genres,
    hasFile    : movie.hasFile,
    id         : movie.id,
    isAvailable: movie.isAvailable,
    monitored  : movie.monitored,
    status     : movie.status,
    title      : movie.title,
    year       : movie.year,
    // For search:
    studio     : movie.studio || '',
    imdbId     : movie.imdbId,
    tmdbId     : movie.tmdbId,
    // For sort:
    added      : movie.added,
    sortTitle  : movie.sortTitle,
    movieFile  : { dateAdded: movie.movieFile && movie.movieFile.dateAdded ? movie.movieFile.dateAdded : null },
  }))*/
})

/**
 * [getFinalPage description]
 * @type {[type]}
 */
const getFinalPage = createDeepEqualSelector(getQueueArray, queueArray => Math.ceil(queueArray.length / config.queuePerPage))

/**
 * Get movie array for current page
 * @return {array}
 */
export const getQueueArrayForPage = createDeepEqualSelector([ getQueueArray, getCurrentPage, getFinalPage ], (queueArray, currentPage, finalPage) => {
  if (!currentPage || currentPage < 1) currentPage = 1
  if (currentPage > finalPage) currentPage = finalPage

  // We are adding more, not removing previous
  const start = 0
  const offset = (currentPage - 1) * config.queuePerPage
  const end = offset + config.queuePerPage

  return queueArray.slice(start, end)
})

/**
 * [getIsLastPage description]
 * @type {[type]}
 */
export const getIsLastPage = createSelector([ getCurrentPage, getFinalPage ], (currentPage, finalPage) => currentPage >= finalPage)
