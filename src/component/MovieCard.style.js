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
    backgroundColor : theme.bodyBgLight,
    borderRadius    : theme.grid / 4,
    flex            : 0,
    flexDirection   : 'row',
    justifyContent  : 'flex-start',
    alignItems      : 'stretch',
    alignSelf       : 'stretch',
    overflow        : 'hidden',
    marginHorizontal: theme.grid / 4,
    height          : theme.movieCard.height,
  },

  image: {
    borderRadius: theme.grid / 4,
    width       : theme.movieCard.width,
    height      : theme.movieCard.height,
  },

  containerRight: {
    flex          : 1,
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'stretch',
    margin        : theme.grid / 3,
    marginVertical: theme.grid / 5,
  },

  containerInfo: {
    flex          : 1,
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'stretch',
  },

  containerTags: {
    flex          : 1,
    flexDirection : 'column',
    justifyContent: 'flex-end',
    alignItems    : 'flex-start',
  },

  containerTagsInner: {
    flexDirection : 'row',
    flexWrap      : 'wrap',
    justifyContent: 'flex-start',
    alignItems    : 'flex-start',
  },

  title: {
    color   : theme.fontColor,
    fontSize: theme.fontSizeLg,
  },

  year: {
    color   : theme.fontColorFader,
    fontSize: theme.fontSize,
  },

  tag: {
    marginRight: theme.grid / 6,
    marginTop  : theme.grid / 6,
  },
})
