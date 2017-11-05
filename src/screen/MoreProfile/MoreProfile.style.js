/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import { StyleSheet } from 'react-native'

/////////////////
// Third-party //
/////////////////

////////////
// Custom //
////////////
import { theme } from 'src/constant'

//////////
// Init //
//////////
export default StyleSheet.create({
  language: {
    color: theme.fontColorFade,
  },

  quality: {
    fontSize: theme.fontSizeSm,
  },

  rest: {
    color: theme.fontColorFade,
  },
})
