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
  modalContainer: {
    flex    : 1,
    position: 'relative',
  },
  modalPosterContainer: {
    flex          : 1,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'stretch',
    margin        : 0,
    padding       : 0,
    position      : 'relative',
  },
  modalPoster: {
    flex : 1,
    width: null,
  },
  modalButtonContainer: {
    position       : 'absolute',
    top            : 0,
    right          : 0,
    zIndex         : 10,
    elevation      : 10,
    padding        : theme.grid / 2,
    backgroundColor: 'transparent',
  },
  modalButton: {
    color          : theme.fontColor,
    fontSize       : theme.fontSizeXx,
    backgroundColor: 'transparent',
  },

  bannerImage: {
    flex          : 1,
    width         : null,
    height        : 200,
    flexDirection : 'column',
    justifyContent: 'center',
    alignItems    : 'center',
    alignSelf     : 'stretch',
  },

  iconPlay: {
    color           : theme.fontColor,
    fontSize        : theme.fontSizeXx * 2,
    padding         : theme.grid / 2,
    backgroundColor : 'transparent',
    marginTop       : theme.movieCard.height / 4 * -1,
    textShadowColor : 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },

  bannerGradient: {
    elevation: 1,
    zIndex   : 1,
    height   : 100,
    marginTop: -100,
  },

  movieCard: {
    elevation: 2,
    zIndex   : 2,
    marginTop: theme.movieCard.height / 4 * -1,
  },

  titleContainer: {
    flexDirection : 'row',
    justifyContent: 'flex-start',
    alignItems    : 'center',
    margin        : theme.grid / 2,
    marginBottom  : theme.grid / 6,
  },
  title: {
    color   : theme.fontColorFader,
    fontSize: theme.fontSizeXs,
  },

  linePrimary: {
    flex           : 1,
    backgroundColor: theme.brandPrimary,
    height         : StyleSheet.hairlineWidth,
    marginLeft     : theme.grid / 2,
  },
  lineSuccess: {
    flex           : 1,
    backgroundColor: theme.brandSuccess,
    height         : StyleSheet.hairlineWidth,
    marginLeft     : theme.grid / 2,
  },
  lineInfo: {
    flex           : 1,
    backgroundColor: theme.brandInfo,
    height         : StyleSheet.hairlineWidth,
    marginLeft     : theme.grid / 2,
  },
  lineWarning: {
    flex           : 1,
    backgroundColor: theme.brandWarning,
    height         : StyleSheet.hairlineWidth,
    marginLeft     : theme.grid / 2,
  },
  lineError: {
    flex           : 1,
    backgroundColor: theme.brandError,
    height         : StyleSheet.hairlineWidth,
    marginLeft     : theme.grid / 2,
  },

  overviewContainer: {
    backgroundColor: theme.bodyBgLightish,
    padding        : theme.grid / 2,
    marginBottom   : theme.grid / 4,
  },
  overview: {
    color    : theme.fontColor,
    fontSize : theme.fontSize,
    textAlign: 'justify',
  },

  infoContainer: {
    backgroundColor: theme.bodyBgLightish,
    marginBottom   : theme.grid / 4,
    flexDirection  : 'column',
    justifyContent : 'flex-start',
    alignItems     : 'stretch',
  },

  fileContainer: {
    backgroundColor: theme.bodyBgLightish,
    marginBottom   : theme.grid / 4,
    flexDirection  : 'column',
    justifyContent : 'flex-start',
    alignItems     : 'stretch',
  },
  filePath: {
    padding  : theme.grid / 4,
    color    : theme.fontColor,
    fontSize : theme.fontSizeSm,
    textAlign: 'center',
  },
  fileInfo: {
    color   : theme.fontColorFade,
    fontSize: theme.fontSizeSm,
  },

  fileDetailsContainer: {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    paddingHorizontal: theme.grid / 2,
    paddingBottom    : theme.grid / 4,
  },
  fileDetailsExpandedContainer: {
    flexDirection : 'column',
    justifyContent: 'flex-start',
    alignItems    : 'stretch',
  },

  fileDetailsRow: {
    flexDirection    : 'row',
    justifyContent   : 'space-between',
    alignItems       : 'center',
    paddingHorizontal: theme.grid / 2,
    paddingVertical  : theme.grid / 6,
  },
  fileDetailsRowStrip: {
    backgroundColor: 'rgba(0,0,0,.20)',
  },

  fileDetailsExpanded: {
    flex      : 1,
    flexWrap  : 'nowrap',
    marginLeft: theme.grid / 6,
    color     : theme.fontColorFade,
    fontSize  : theme.fontSizeSm,
    textAlign : 'right',
  },
  fileDetailsExpandedTitle: {
    color    : theme.fontColor,
    fontSize : theme.fontSizeSm,
    textAlign: 'left',
  },

  outLinkContainer: {
    flexDirection : 'row',
    justifyContent: 'space-around',
    alignItems    : 'center',
    marginVertical: theme.grid / 4,
  },
  outLinkImage: {
    width            : 64,
    height           : 64,
    paddingVertical  : theme.grid / 2,
    paddingHorizontal: theme.grid * 2,
  },
})
