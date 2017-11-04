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
import { createSelector } from 'reselect'
import moment from 'moment'

////////////
// Custom //
////////////

//////////
// Init //
//////////
const systemStatusGetter = state => state.systemStatus

export const getSystemStatusArray = createSelector(systemStatusGetter, status => [
  { key: 10, text: 'branch', value: status.branch, raw: true },
  { key: 20, text: 'version', value: status.version, raw: true },
  { key: 30, text: 'buildTime', value: moment(status.buildTime).format('lll'), raw: true },
  { key: 40, text: 'os', value: status.isLinux ? 'linux' : status.isOsx ? 'osx' : status.isWindows ? 'windows' : 'unknown' },
])
