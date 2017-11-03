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
import randomString from './randomString'
import queryString from './queryString'

//////////
// Init //
//////////
/**
 * Build and return url for server
 * @param  {String} server   Server
 * @param  {String} endpoint Where to point the url to
 * @param  {Object} params   Params to add to url
 * @return {String}          URL pointing to API
 */
export default (server, endpoint, params = {}) => {
  params = { rs: randomString(), ...params }

  return `${buildUrl(server)}/${endpoint.replace(/(\/)(?=\/*\1)/g, '').replace(/^\/?/, '')}${queryString.from(params)}`
}

/**
 * Build and return url for server
 * @param  {String} server   Server
 * @return {String}          URL pointing to API
 */
export function buildUrl(server) {
  const { host, port, urlBase, ssl } = server

  return `http${ssl === true ? 's' : ''}://${host}:${port}${urlBase || ''}/api`
}

/**
 * [fixHost description]
 * @param  {[type]} host [description]
 * @return {[type]}      [description]
 */
export function fixHost(host) {
  // 'https://www.google.com' => 'www.google.com'
  return host.replace(/^.*:\/\//, '')
}

/**
 * [fixPort description]
 * @param  {[type]} port [description]
 * @return {[type]}      [description]
 */
export function fixPort(port) {
  // Make sure port is number
  try {
    return parseInt(port)
  } catch (err) {
    throw new TypeError('Port is not a number')
  }
}

/**
 * [fixUrlBase description]
 * @param  {[type]} urlBase [description]
 * @return {[type]}         [description]
 */
export function fixUrlBase(urlBase) {
  if (!urlBase) return ''

  // Starts: 'web///radarr///' => 'web/radarr/' => '/web/radarr/' => '/web/radarr'
  const final = urlBase
    .replace(/(\/)(?=\/*\1)/g, '')
    .replace(/^\/?/, '/')
    .replace(/\/?$/, '')

  return final || ''
}
