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
    flex          : 1,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'stretch',
    paddingTop    : theme.appBarHeight + theme.statusBarHeight,
  },

  containerLandscape: {
    justifyContent: 'flex-start',
    paddingTop    : theme.grid * 1.3,
  },

  rowContainer: {
    flexDirection : 'row',
    justifyContent: 'space-around',
    alignItems    : 'center',
    marginVertical: theme.grid / 4,
  },

  separator: {
    marginVertical: theme.grid / 4,
  },

  label: {
    fontSize       : theme.fontSizeLg,
    textAlign      : 'center',
    backgroundColor: 'transparent',
  },

  iconContainer: {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'center',
    width         : theme.fontSizeXx * 2 * 1.5,
    height        : theme.fontSizeXx * 2 * 1.5,
  },
  icon: {
    fontSize       : theme.fontSizeXx * 2,
    textAlign      : 'center',
    backgroundColor: 'transparent',
  },

  helper: {
    fontSize        : theme.fontSizeSm,
    color           : 'rgba(255,255,255,.69)',
    textAlign       : 'center',
    backgroundColor : 'transparent',
    marginHorizontal: theme.grid,
    marginTop       : theme.grid / 8,
  },

  input: {
    fontSize         : theme.fontSizeLg,
    textAlign        : 'center',
    height           : theme.grid * 2,
    paddingHorizontal: theme.grid / 2,
    marginVertical   : theme.grid / 2,
    marginHorizontal : theme.grid,
    borderRadius     : theme.grid / 4,
  },

  button: {
    flex             : 1,
    height           : theme.grid * 2,
    paddingHorizontal: theme.grid / 2,
    marginVertical   : theme.grid / 2,
    marginHorizontal : theme.grid,
    backgroundColor  : 'transparent',
    borderColor      : theme.brandPrimaryDarkest,
    borderRadius     : theme.grid / 4,
    borderWidth      : StyleSheet.hairlineWidth * 3,
  },

  buttonSelected: {
    backgroundColor: theme.brandPrimaryDarkest,
    borderColor    : 'rgba(0,0,0,0)',
  },

  labelIcon: {
    marginTop: theme.grid,
  },

  labelIconLandscape: {
    marginTop: 0,
  },

  carousel: {
    marginTop: theme.grid / 2,
    flexGrow : 0,
  },

  carouselLandscape: {
    marginTop : 0,
    marginLeft: theme.grid / 2,
    flexGrow  : 1,
  },

  colorPicker: {
    flex   : 1,
    padding: theme.grid,
  },

  colorPickerLandscape: {},

  innerContainer: {
    flex    : 1,
    overflow: 'hidden',
  },

  innerContainerLandscape: {
    flex          : 1,
    flexDirection : 'row',
    justifyContent: 'space-around',
    alignItems    : 'center',
    overflow      : 'hidden',
  },
})
