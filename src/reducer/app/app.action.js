/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import { LayoutAnimation } from 'react-native'

/////////////////
// Third-party //
/////////////////

////////////
// Custom //
////////////
import TYPE from './app.type'
import { config } from 'src/constant'
import { localization } from 'src/localization'
import { randomString } from 'src/lib'

//////////
// Init //
//////////
/**
 * Set current locale
 * @param  {string} currentLocale Locale identifier
 * @return {object}
 */
export function setCurrentLocale(currentLocale) {
  localization.changeLocale(currentLocale)

  return { type: TYPE.SET_CURRENT_LOCALE, payload: currentLocale }
}

/**
 * Set a component to appear in fullscreen
 * @param  {component} fullscreen A component
 * @return {object}
 */
export function setFullscreen(fullscreen) {
  return { type: TYPE.SET_FULLSCREEN, payload: fullscreen }
}

/**
 * Set if the network activity indicator should be visible at status bar
 * @param  {bool} hasNetworkActivity True or false
 * @return {object}
 */
export function setNetworkActivity(hasNetworkActivity) {
  return { type: TYPE.SET_NETWORK_ACTIVITY, payload: hasNetworkActivity }
}

/**
 * Display message to user
 * @param  {object} notificationObj Object with message, time and type, or null to hide notification bar
 * @return {object}
 */
export function setNotification(notificationObj) {
  if (!notificationObj || !notificationObj.message) {
    return
  }

  const notification = {
    key      : randomString(),
    message  : notificationObj.message,
    type     : config.notificationTypeArray.includes(notificationObj.type) ? notificationObj.type : config.notificationTypeDefault,
    statusBar: notificationObj.statusBar || false,
    serverKey: notificationObj.serverKey || null,
  }

  LayoutAnimation.linear()
  return { type: TYPE.SET_NOTIFICATION, payload: notification }
}

/**
 * [removeNotification description]
 * @return {[type]} [description]
 */
export function removeNotification() {
  return { type: TYPE.REMOVE_NOTIFICATION }
}
