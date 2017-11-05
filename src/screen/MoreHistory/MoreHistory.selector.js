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

const getHistoryList = state => state.history.records
const getCurrentPage = state => state.MoreHistory.currentPage

const getHistoryArray = createDeepEqualSelector(getHistoryList, historyList => {
  // Reduce history data
  return historyList.map(item => ({
    data               : item.data,
    date               : item.date,
    eventType          : item.eventType,
    id                 : item.id,
    movie              : { id: item.movie.id, title: item.movie.title },
    publishedDate      : item.publishedDate,
    quality            : { quality: item.quality.quality },
    qualityCutoffNotMet: item.qualityCutoffNotMet,
    sourceTitle        : item.sourceTitle,
  }))
})

/**
 * [getFinalPage description]
 * @type {[type]}
 */
const getFinalPage = createDeepEqualSelector(getHistoryArray, historyArray => Math.ceil(historyArray.length / config.historyPerPage))

/**
 * Get history array for current page
 * @return {array}
 */
export const getHistoryArrayForPage = createDeepEqualSelector([ getHistoryArray, getCurrentPage, getFinalPage ], (historyArray, currentPage, finalPage) => {
  if (!currentPage || currentPage < 1) currentPage = 1
  if (currentPage > finalPage) currentPage = finalPage

  // We are adding more, not removing previous
  const start = 0
  const offset = (currentPage - 1) * config.historyPerPage
  const end = offset + config.historyPerPage

  return historyArray.slice(start, end)
})

/**
 * [getIsLastPage description]
 * @type {[type]}
 */
export const getIsLastPage = createSelector([ getCurrentPage, getFinalPage ], (currentPage, finalPage) => currentPage >= finalPage)
