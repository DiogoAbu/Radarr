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
import { createConstant } from 'src/lib'

//////////
// Init //
//////////
export default createConstant(
  'SET_CURRENT_LOCALE',
  'SET_FULLSCREEN',
  'SET_NETWORK_ACTIVITY',
  'SET_NOTIFICATION',
  'REMOVE_NOTIFICATION',
)
