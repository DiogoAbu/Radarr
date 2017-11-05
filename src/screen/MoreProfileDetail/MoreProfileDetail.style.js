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
  titleContainer: {
    flex        : 0,
    flexGrow    : 1,
    paddingRight: theme.grid / 2,
  },

  valueContainer: {
    flex: -1,
  },

  titleList: {
    fontSize  : theme.fontSizeLg,
    color     : theme.fontColorFade,
    padding   : theme.grid / 4,
    paddingTop: theme.grid / 2,
  },
})
