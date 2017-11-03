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
  queueList: {
    flex           : 1,
    backgroundColor: theme.bodyBg,
  },

  footerComponent: {
    color         : theme.fontColorFader,
    textAlign     : 'center',
    marginVertical: theme.grid / 2,
  },
})
