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
export default (...constants) => {
  return constants.reduce((acc, constant) => {
    acc[constant] = constant
    return acc
  }, {})
}
