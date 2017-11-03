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
  fullscrenView: {
    flex           : 1,
    flexDirection  : 'column',
    justifyContent : 'center',
    alignItems     : 'stretch',
    margin         : 0,
    padding        : 0,
    backgroundColor: theme.bodyBg,
  },
})
