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
  'SET_MOVIEINDEX_QUERY',
  'SET_MOVIEINDEX_CURRENT_PAGE',
  'SET_MOVIEINDEX_SORT',
  'SET_MOVIEINDEX_ACTIVE',
)
