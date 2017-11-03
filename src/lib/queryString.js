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
export default {
  from: json => {
    const keys = Object.keys(json)

    if (!json || keys.length === 0) {
      return {}
    }

    return '?' + keys.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(json[key])}`).join('&')
  },

  parse: queryString => {
    const query = queryString.replace(/.*\?/, '')

    return query.split('&').reduce((obj, item) => {
      if (item) {
        item = item.split('=')
        obj[item[0]] = item[1]
        return obj
      }
    }, {})
  },
}
