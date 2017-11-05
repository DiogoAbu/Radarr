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
  footerComponent: {
    color         : theme.fontColorFader,
    textAlign     : 'center',
    marginVertical: theme.grid / 2,
  },

  below: {
    color   : theme.fontColorFade,
    fontSize: theme.fontSizeSm,
  },
})
