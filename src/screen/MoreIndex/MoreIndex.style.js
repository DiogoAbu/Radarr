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
  centerContainer: {
    //paddingLeft: theme.grid / 6,
  },

  title: {
    color   : theme.fontColor,
    fontSize: theme.fontSizeLg,
  },

  url: {
    color   : theme.fontColorFade,
    fontSize: theme.fontSizeSm,
  },
})
