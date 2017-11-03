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
import typechecker from 'typechecker'

////////////
// Custom //
////////////

//////////
// Init //
//////////
export default (server, skip = []) => {
  if (!skip.includes('key') && !typechecker.isString(server.key)) throw new Error('Invalid Server Key')

  if (!skip.includes('name') && !typechecker.isString(server.name)) throw new Error('Invalid Server Name')

  if (!skip.includes('icon') && !typechecker.isString(server.icon)) throw new Error('Invalid Server Icon')

  if (!skip.includes('iconColor') && !typechecker.isString(server.iconColor)) throw new Error('Invalid Server Icon Color')

  if (!skip.includes('host') && !typechecker.isString(server.host)) throw new Error('Invalid Server Host')

  if (!skip.includes('port') && !typechecker.isNumber(server.port)) throw new Error('Invalid Server Port')

  if (!skip.includes('ssl') && !typechecker.isBoolean(server.ssl)) throw new Error('Invalid Server Ssl')

  if (!skip.includes('apiKey') && !typechecker.isString(server.apiKey)) throw new Error('Invalid Server Api Key')

  return true
}
