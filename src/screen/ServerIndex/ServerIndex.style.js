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

  noServerTitle: {
    color    : theme.fontColorFader,
    textAlign: 'center',
    padding  : theme.grid,
  },

  footerContainer: {
    position       : 'absolute',
    bottom         : 0,
    left           : 0,
    right          : 0,
    backgroundColor: theme.headerBg,
    zIndex         : 1,
    elevation      : 1,
    flexDirection  : 'row',
    justifyContent : 'space-around',
    alignItems     : 'center',
    alignSelf      : 'stretch',
  },

  buttonRemoveAll: {
    flex           : 1,
    backgroundColor: theme.brandError,
  },
  buttonRemoveSelected: {
    flex           : 1,
    backgroundColor: theme.brandWarningDarker,
  },

  modalOuterContainer: {
    flex           : 1,
    backgroundColor: 'rgba(0,0,0,.67)',
  },

  modalContainer: {
    flex            : 1,
    backgroundColor : theme.bodyBg,
    marginHorizontal: theme.grid,
    marginVertical  : theme.grid * 4,
    borderRadius    : theme.grid / 4,
    position        : 'relative',
    overflow        : 'hidden',
  },

  logo: {
    width       : 64,
    height      : 64,
    marginBottom: theme.grid,
    alignSelf   : 'center',
  },

  aboutTitle: {
    fontSize : theme.fontSizeLg,
    margin   : theme.grid / 4,
    textAlign: 'center',
  },

  aboutURL: {
    color           : theme.fontColorFade,
    marginHorizontal: theme.grid / 4,
    textAlign       : 'center',
  },

  aboutButton: {
    flex     : 0,
    alignSelf: 'stretch',
    margin   : theme.grid,
  },
})
