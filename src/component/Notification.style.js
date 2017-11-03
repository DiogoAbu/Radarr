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
    flex             : 0,
    flexDirection    : 'column',
    justifyContent   : 'center',
    alignItems       : 'stretch',
    alignSelf        : 'stretch',
    position         : 'absolute',
    top              : theme.notificationTopDistance,
    left             : 0,
    right            : 0,
    elevation        : 99999,
    zIndex           : 99999,
    height           : theme.notificationHeight,
    paddingHorizontal: theme.grid / 4,
    borderTopWidth   : StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,

    backgroundColor  : theme.brandDefaultDark,
    borderTopColor   : theme.brandDefault,
    borderBottomColor: theme.brandDefault,
  },

  statusBarTrue: {
    top: 0,
  },

  success: { backgroundColor: theme.brandSuccessDarkest, borderTopColor: theme.brandSuccessDarker, borderBottomColor: theme.brandSuccessDarker },
  info   : { backgroundColor: theme.brandInfoDarkest, borderTopColor: theme.brandInfoDarker, borderBottomColor: theme.brandInfoDarker },
  warning: { backgroundColor: theme.brandWarningDarker, borderTopColor: theme.brandWarningDark, borderBottomColor: theme.brandWarningDark },
  error : { backgroundColor: theme.brandError, borderTopColor: theme.brandErrorLight, borderBottomColor: theme.brandErrorLight },

  message: {
    color    : theme.fontColor,
    textAlign: 'center',
    fontSize : theme.fontSizeSm,
  },
})
