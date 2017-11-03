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
export default (...listOfPromises) => {
  return new Promise(async (resolve, reject) => {
    const results = []
    for (const promise of listOfPromises.map(Promise.resolve, Promise)) {
      results.push(await promise.then(async resolvedData => await resolvedData, reject))
      if (results.length === listOfPromises.length) resolve(results)
    }
  })
}
