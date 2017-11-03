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

//////////
// Init //
//////////
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

const movieListGetter = state => state.movie.list
const movieIdGetter = state => state.MovieIndex.activeId
const profileListGetter = state => state.profile.list

export const getMovie = createDeepEqualSelector([ movieListGetter, movieIdGetter ], (movieList, movieId) => {
  const movie = movieList.find(movie => movie.id === movieId)
  return {
    downloaded         : movie.downloaded,
    genres             : movie.genres,
    hasFile            : movie.hasFile,
    id                 : movie.id,
    imdbId             : movie.imdbId,
    inCinemas          : movie.inCinemas,
    isAvailable        : movie.isAvailable,
    minimumAvailability: movie.minimumAvailability,
    monitored          : movie.monitored,
    movieFile          : movie.movieFile,
    overview           : movie.overview,
    path               : movie.path,
    profileId          : movie.profileId,
    ratings            : movie.ratings,
    runtime            : movie.runtime,
    status             : movie.status,
    studio             : movie.studio,
    title              : movie.title,
    tmdb               : movie.tmdb,
    tmdbId             : movie.tmdbId,
    year               : movie.year,
    youTubeTrailerId   : movie.youTubeTrailerId,
    // For MovieEdit:
    images             : movie.images,
  }
})

const profileIdGetter = createSelector(getMovie, movie => movie.profileId)

export const getProfile = createSelector([ profileListGetter, profileIdGetter ], (profileList, profileId) => {
  const profile = profileList.find(profile => profile.id === profileId)
  return profile && profile.name ? profile.name : profileId
})
