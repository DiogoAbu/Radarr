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
  titleList: {
    fontSize  : theme.fontSizeLg,
    color     : theme.fontColorFade,
    padding   : theme.grid / 4,
    paddingTop: theme.grid / 2,
  },
})
