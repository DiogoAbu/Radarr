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
    flex           : 0,
    flexDirection  : 'row',
    justifyContent : 'flex-start',
    alignItems     : 'center',
    alignSelf      : 'stretch',
    flexWrap       : 'nowrap',
    backgroundColor: theme.listItemBg,
  },

  left: {
    flex             : 0,
    flexDirection    : 'row',
    justifyContent   : 'flex-start',
    alignItems       : 'center',
    flexWrap         : 'nowrap',
    paddingHorizontal: theme.grid / 1.5,
  },

  center: {
    flex          : 1,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'flex-start',
    flexWrap      : 'nowrap',
    paddingLeft   : theme.grid / 5,
  },

  centerNoLeft: {
    paddingLeft: theme.grid / 2,
  },

  centerNoRight: {
    paddingRight: theme.grid / 2,
  },

  right: {
    flex             : 0,
    flexDirection    : 'row',
    justifyContent   : 'flex-end',
    alignItems       : 'center',
    flexWrap         : 'nowrap',
    paddingHorizontal: theme.grid / 1.5,
  },

  textRight: {
    textAlign: 'right',
  },

  item: {
    fontSize: theme.fontSize,
    color   : theme.listItemFontColor,
  },

  icon: {
    fontSize: theme.fontSizeLg,
  },

  go: {
    fontSize: theme.fontSizeXx,
  },
})
