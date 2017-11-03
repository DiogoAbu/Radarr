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
export default server => ({
  Accept        : 'application/json',
  'Content-Type': 'application/json',
  'X-Api-Key'   : server.apiKey,
})
