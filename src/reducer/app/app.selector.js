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
import typechecker from 'typechecker'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import { theme } from 'src/constant'

//////////
// Init //
//////////
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

const getNotification = state => state.app.notification
const getNotificationArray = state => state.app.notificationArray
const getServerActive = state => state.server.active
const getIndexAndRoutes = state => ({ index: state.nav.index, routes: state.nav.routes })
const readAction = action => action


/**
 * [getHasNotificationStyle description]
 * @type   {[type]}
 * @return {[type]}
 */
export const getHasNotificationStyle = createDeepEqualSelector(
  getNotification,
  notification => {
    if(!notification.message) return
    if(notification.statusBar) return
    return theme.style.hasNotification
  }
)

/**
 * [setCurrentLocaleAction description]
 * @type {[type]}
 */
export const setCurrentLocaleAction = createSelector(
  readAction,
  ({ setCurrentLocale }) => setCurrentLocale
)

/**
 * [setFullscreenAction description]
 * @type {[type]}
 */
export const setFullscreenAction = createSelector(
  readAction,
  ({ setFullscreen }) => setFullscreen
)

/**
 * [setNetworkActivityAction description]
 * @type {[type]}
 */
export const setNetworkActivityAction = createSelector(
  readAction,
  ({ setNetworkActivity }) => setNetworkActivity
)

/**
 * [setNotificationAction description]
 * @type {[type]}
 */
export const setNotificationAction = createSelector(
  readAction,
  ({ setNotification }) => setNotification
)

/**
 * [removeNotificationAction description]
 * @type {[type]}
 */
export const removeNotificationAction = createSelector(
  readAction,
  ({ removeNotification }) => removeNotification
)

/**
 * [getNotificationArrayForServer description]
 * @type {[type]}
 */
export const getNotificationArrayForServer = createDeepEqualSelector(
  [ getNotificationArray, getServerActive ],
  (notificationArray, server) => (!server || !server.key ? [] : notificationArray.filter(e => e.serverKey === server.key))
)

/**
 * [getRoutePath description]
 * @type {[type]}
 */
export const getRoutePath = createSelector(
  getIndexAndRoutes,
  ({ index, routes }) => getRoute(index, routes)
)

/**
 * [getCurrentRoute description]
 * @type {[type]}
 */
export const getCurrentRoute = createSelector(
  getIndexAndRoutes,
  ({ index, routes }) => getRoute(index, routes).split('/').pop()
)

/**
 * [getHasGoBack description]
 * @type   {[type]}
 * @return {[type]}
 */
export const getHasGoBack = createDeepEqualSelector(
  getIndexAndRoutes,
  ({ index, routes }) => {
    const path = getRoute(index, routes, '', true).split('/')
    return path[path.length - 2] !== 0
  }
)

/**
 * [getRoute description]
 * @param  {[type]} index    [description]
 * @param  {[type]} routes   [description]
 * @param  {[type]} prev     [description]
 * @param  {[type]} getIndex [description]
 * @return {[type]}          [description]
 */
function getRoute(index, routes, prev = '', getIndex){
  const getKey = getIndex ? 'index' : 'routeName'

  // Have an route array to iterate?
  if(typechecker.isArray(routes) && routes[index] && routes[index].hasOwnProperty('index')){
    // Append new route name
    prev = `${prev}/${routes[index][getKey] || 0}`
    // Iterate new route array
    return getRoute(routes[index].index, routes[index].routes, prev, getIndex)
  }
  // No more routes, set final route name and return
  return `${prev}/${routes[index][getKey] || 0}`
}
