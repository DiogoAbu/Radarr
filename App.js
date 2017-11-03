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

//////////
// Init //
//////////
if (!__DEV__) {
  console.assert = () => {}
  console.clear = () => {}
  console.count = () => {}
  console.dir = () => {}
  console.dirxml = () => {}
  console.error = () => {}
  console.group = () => {}
  console.groupCollapsed = () => {}
  console.groupEnd = () => {}
  console.info = () => {}
  console.log = () => {}
  console.profile = () => {}
  console.profileEnd = () => {}
  console.table = () => {}
  console.time = () => {}
  console.timeEnd = () => {}
  console.timeStamp = () => {}
  console.trace = () => {}
  console.warn = () => {}
}

import { Init } from 'src'

export default Init
