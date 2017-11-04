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
    flex          : 1,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'stretch',
    alignSelf     : 'stretch',
  },

  path: {
    marginBottom: theme.grid / 6,
  },

  sizeContainer: {
    flexDirection : 'row',
    justifyContent: 'space-between',
    alignItems    : 'center',
    marginTop     : theme.grid / 6,
  },

  size: {
    color: theme.fontColorFade,
  },

  sizeRight: {
    textAlign: 'right',
  },
})
