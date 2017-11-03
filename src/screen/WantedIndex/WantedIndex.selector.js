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

const getWantedList = state => state.wantedMissing.list
const getCurrentPage = state => state.WantedIndex.currentPage

const getWantedArray = createDeepEqualSelector(getWantedList, wantedList => {
  return wantedList
  // Reduce movie data
  /*return wantedList.map(movie => ({
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
const getFinalPage = createDeepEqualSelector(getWantedArray, wantedArray => Math.ceil(wantedArray.length / config.wantedPerPage))

/**
 * Get movie array for current page
 * @return {array}
 */
export const getWantedArrayForPage = createDeepEqualSelector([ getWantedArray, getCurrentPage, getFinalPage ], (wantedArray, currentPage, finalPage) => {
  if (!currentPage || currentPage < 1) currentPage = 1
  if (currentPage > finalPage) currentPage = finalPage

  // We are adding more, not removing previous
  const start = 0
  const offset = (currentPage - 1) * config.wantedPerPage
  const end = offset + config.wantedPerPage

  return wantedArray.slice(start, end)
})

/**
 * [getIsLastPage description]
 * @type {[type]}
 */
export const getIsLastPage = createSelector([ getCurrentPage, getFinalPage ], (currentPage, finalPage) => currentPage >= finalPage)
