/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import { Platform, StyleSheet } from 'react-native'

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
  movieList: {
    flex           : 1,
    backgroundColor: theme.bodyBg,
    paddingVertical: theme.grid / 6,
  },

  movieListHorizontal: {
    flex  : 0,
    height: theme.moviePoster.height,
  },

  itemSeparator: {
    marginVertical: theme.grid / 6,
  },

  itemSeparatorHorizontal: {
    marginHorizontal: theme.grid / 6,
  },

  titleList: {
    fontSize : theme.fontSizeLg,
    color    : theme.fontColorFade,
    padding  : theme.grid / 4,
    marginTop: theme.grid / 4,
  },

  footerComponent: {
    color         : theme.fontColorFader,
    textAlign     : 'center',
    marginVertical: theme.grid / 2,
  },

  hideOverflow: {
    overflow: 'hidden',
  },

  headerSearch: {
    flex             : 1,
    alignSelf        : 'stretch',
    textAlign        : 'center',
    color            : theme.fontColor,
    paddingVertical  : 0,
    paddingHorizontal: theme.grid / 2,
    marginVertical   : theme.grid / 3,
    marginHorizontal : Platform.OS === 'android' ? theme.grid / 2 + theme.grid / 4 : theme.grid / 8,
    backgroundColor  : theme.inputBgHeader,
    borderRadius     : theme.grid,
  },

  gettingMoviesLoad: {
    color    : theme.fontColorFader,
    textAlign: 'center',
    marginTop: theme.grid,
  },

  sortModalOuterContainer: {
    flex           : 1,
    backgroundColor: 'rgba(0,0,0,.67)',
  },

  sortModalContainer: {
    flex            : 1,
    backgroundColor : theme.bodyBg,
    marginHorizontal: theme.grid,
    marginVertical  : theme.grid * 4,
    borderRadius    : theme.grid / 4,
    position        : 'relative',
    overflow        : 'hidden',
  },

  sortModalContainerSelecting: {
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'stretch',
  },
})
