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
  container: {
    backgroundColor: theme.brandPrimary,
    borderRadius   : theme.grid / 4,
    overflow       : 'hidden',
  },

  tag: {
    color            : theme.grayLighter,
    paddingVertical  : theme.grid / 6,
    paddingHorizontal: theme.grid / 4,
    fontSize         : theme.fontSize,
  },

  default: {
    backgroundColor: theme.brandDefaultDarker,
  },
  primary: {
    backgroundColor: theme.brandPrimary,
  },
  success: {
    backgroundColor: theme.brandSuccessDarkest,
  },
  info: {
    backgroundColor: theme.brandInfoDarkest,
  },
  warning: {
    backgroundColor: theme.brandWarningDarker,
  },
  error: {
    backgroundColor: theme.brandError,
  },
})
