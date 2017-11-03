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
    backgroundColor: theme.bodyBgLight,
    borderRadius   : theme.grid / 4,
    flex           : 1,
    flexDirection  : 'column',
    justifyContent : 'flex-start',
    alignItems     : 'stretch',
    overflow       : 'hidden',
    marginVertical : theme.grid / 4,
    width          : theme.moviePoster.width,
    height         : theme.moviePoster.height,
  },

  image: {
    flex          : 1,
    flexDirection : 'column',
    justifyContent: 'flex-end',
    alignItems    : 'stretch',
    width         : null,
    height        : null,
    borderRadius  : theme.grid / 4,
  },

  overlay: {
    backgroundColor        : 'rgba(0,0,0,.67)',
    paddingHorizontal      : theme.grid / 3,
    paddingVertical        : theme.grid / 5,
    borderBottomLeftRadius : theme.grid / 4,
    borderBottomRightRadius: theme.grid / 4,
  },

  title: {
    color   : theme.grayLighter,
    fontSize: theme.fontSizeLg,
  },

  year: {
    color   : theme.fontColorFader,
    fontSize: theme.fontSize,
  },
})
