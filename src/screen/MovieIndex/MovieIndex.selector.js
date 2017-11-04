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
import FuzzySearch from 'FuzzySearch'

////////////
// Custom //
////////////
import { config } from 'src/constant'
import { sortMovie } from 'src/lib'

//////////
// Init //
//////////
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

const getMovieList = state => state.movie.list
const getQuery = state => state.MovieIndex.query
const getCurrentPage = state => state.MovieIndex.currentPage
const getSort = state => state.MovieIndex.sort

const getMovieArray = createDeepEqualSelector(getMovieList, movieList => {
  // Reduce movie data
  return movieList.map(movie => ({
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
  }))
})

/**
 * [getFinalPage description]
 * @type {[type]}
 */
const getFinalPage = createDeepEqualSelector(getMovieArray, movieArray => Math.ceil(movieArray.length / config.moviePerPage))

/**
 * [getMovieSorted description]
 * @type {[type]}
 */
const getMovieSorted = createDeepEqualSelector([ getMovieArray, getSort ], (movieArray, sort) => {
  const movieArrayCopy = [ ...movieArray ]

  sort = sort ? sort : {}
  movieArrayCopy.sort(sortMovie[sort.by || 'added'](sort.order || 'DESC'))

  return movieArrayCopy
})

/**
 * Get movie array filtered by query
 * @return {array}
 */
const getMovieSearcher = createDeepEqualSelector(getMovieSorted, movieArray => {
  return new FuzzySearch({
    source              : movieArray,
    keys                : [ 'title', 'genres', 'year', 'studio', 'imdbId', 'tmdbId' ],
    // If a field have this score, stop searching other fields.
    field_good_enough   : 10,
    // if true, split query&field in token, allow to match in different order. False, bypass at least half the computation cost, very fast
    score_per_token     : false,
    // Return up to N result, 0 to disable
    output_limit        : config.movieLocalSearchLimit,
    // when true, any refresh happens only when a user make a search, option stay put until changed.
    lazy                : true,
    interactive_debounce: 0,
  })
})

/**
 * Get movie array filtered by query
 * @return {array}
 */
export const getMovieArrayForQuery = createDeepEqualSelector([ getMovieSearcher, getQuery ], (searcher, query) => {
  return query ? searcher.search(query) : []
})

/**
 * Get movie array for current page
 * @return {array}
 */
export const getMovieArrayForPage = createDeepEqualSelector([ getMovieSorted, getCurrentPage, getFinalPage ], (movieArray, currentPage, finalPage) => {
  if (!currentPage || currentPage < 1) currentPage = 1
  if (currentPage > finalPage) currentPage = finalPage

  // We are adding more, not removing previous
  const start = 0
  const offset = (currentPage - 1) * config.moviePerPage
  const end = offset + config.moviePerPage

  return movieArray.slice(start, end)
})

/**
 * [getMovieArrayDownloaded description]
 * @type {[type]}
 */
export const getMovieArrayDownloaded = createDeepEqualSelector(getMovieArray, movieArray => {
  const movieArrayCopy = [ ...movieArray ]

  movieArrayCopy.sort(sortMovie.fileAdded('DESC'))

  return movieArrayCopy.slice(0, config.movieArrayHorizontalTotal)
})

/**
 * [getIsLastPage description]
 * @type {[type]}
 */
export const getIsLastPage = createSelector([ getCurrentPage, getFinalPage ], (currentPage, finalPage) => currentPage >= finalPage)
