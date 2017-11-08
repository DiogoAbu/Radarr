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

  outerContainer: {
    flexDirection : 'row',
    justifyContent: 'flex-start',
    alignItems    : 'stretch',
  },

  modal: {
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'stretch',
    margin        : 0,
  },

  listCalendar: {
    flex           : 1,
    borderLeftColor: theme.listItemSeparatorBg,
    borderLeftWidth: theme.listItemSeparatorHeight,
  },

  listMonth: {
    flex    : 0,
    flexGrow: 0,
    width   : theme.grid * 3,
  },

  itemMonth: {
    width: theme.grid * 3,
  },

  itemMonthActive: {
    backgroundColor: theme.brandPrimaryDark,
  },
})
