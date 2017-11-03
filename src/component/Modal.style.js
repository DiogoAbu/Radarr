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
  outerContainer: {
    flex           : 1,
    backgroundColor: 'rgba(0,0,0,.67)',
    position       : 'relative',
  },

  iconContainer: {
    position : 'absolute',
    top      : theme.grid * 3,
    right    : theme.grid / 5,
    elevation: 10,
    zIndex   : 10,
  },

  icon: {
    fontSize: theme.fontSizeXx,
    padding : theme.grid / 2,
  },

  container: {
    flex            : 1,
    backgroundColor : theme.bodyBg,
    marginHorizontal: theme.grid,
    marginVertical  : theme.grid * 4,
    borderRadius    : theme.grid / 4,
    position        : 'relative',
    overflow        : 'hidden',
  },
})
