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
import tc from 'tinycolor2'

////////////
// Custom //
////////////

//////////
// Init //
//////////
const theme = {}

////////////
// Colors //
////////////
// Gray scale
theme.grayBase    = '#000'
theme.grayDarker  = tc(theme.grayBase).lighten(13.5).toHexString()
theme.grayDark    = tc(theme.grayBase).lighten(20).toHexString()
theme.gray        = tc(theme.grayBase).lighten(33.5).toHexString()
theme.grayLight   = tc(theme.grayBase).lighten(46.7).toHexString()
theme.grayLighter = tc(theme.grayBase).lighten(93.5).toHexString()

// Semantic color scheme
theme.brandDefault   = '#3b3b48'
theme.brandPrimary   = '#9a28dc'
theme.brandSuccess   = '#73de8b'
theme.brandInfo      = '#53c1fd'
theme.brandWarning   = '#e9dc4c'
theme.brandError    = '#fd5353'

theme.brandDefaultDarkest  = tc(theme.brandDefault).darken(20).toHexString()
theme.brandDefaultDarker   = tc(theme.brandDefault).darken(13.5).toHexString()
theme.brandDefaultDark     = tc(theme.brandDefault).darken(6.7).toHexString()
theme.brandDefaultLight    = tc(theme.brandDefault).lighten(6.7).toHexString()
theme.brandDefaultLighter  = tc(theme.brandDefault).lighten(13.5).toHexString()
theme.brandDefaultLightest = tc(theme.brandDefault).lighten(20).toHexString()
theme.brandDefaultFade     = tc(theme.brandDefault).setAlpha(0.7).toRgbString()
theme.brandDefaultFader    = tc(theme.brandDefault).setAlpha(0.5).toRgbString()
theme.brandDefaultFadest   = tc(theme.brandDefault).setAlpha(0.3).toRgbString()

theme.brandPrimaryDarkest  = tc(theme.brandPrimary).darken(20).toHexString()
theme.brandPrimaryDarker   = tc(theme.brandPrimary).darken(13.5).toHexString()
theme.brandPrimaryDark     = tc(theme.brandPrimary).darken(6.7).toHexString()
theme.brandPrimaryLight    = tc(theme.brandPrimary).lighten(6.7).toHexString()
theme.brandPrimaryLighter  = tc(theme.brandPrimary).lighten(13.5).toHexString()
theme.brandPrimaryLightest = tc(theme.brandPrimary).lighten(20).toHexString()
theme.brandPrimaryFade     = tc(theme.brandPrimary).setAlpha(0.7).toRgbString()
theme.brandPrimaryFader    = tc(theme.brandPrimary).setAlpha(0.5).toRgbString()
theme.brandPrimaryFadest   = tc(theme.brandPrimary).setAlpha(0.3).toRgbString()

theme.brandSuccessDarkest  = tc(theme.brandSuccess).darken(20).toHexString()
theme.brandSuccessDarker   = tc(theme.brandSuccess).darken(13.5).toHexString()
theme.brandSuccessDark     = tc(theme.brandSuccess).darken(6.7).toHexString()
theme.brandSuccessLight    = tc(theme.brandSuccess).lighten(6.7).toHexString()
theme.brandSuccessLighter  = tc(theme.brandSuccess).lighten(13.5).toHexString()
theme.brandSuccessLightest = tc(theme.brandSuccess).lighten(20).toHexString()
theme.brandSuccessFade     = tc(theme.brandSuccess).setAlpha(0.7).toRgbString()
theme.brandSuccessFader    = tc(theme.brandSuccess).setAlpha(0.5).toRgbString()
theme.brandSuccessFadest   = tc(theme.brandSuccess).setAlpha(0.3).toRgbString()

theme.brandInfoDarkest     = tc(theme.brandInfo).darken(20).toHexString()
theme.brandInfoDarker      = tc(theme.brandInfo).darken(13.5).toHexString()
theme.brandInfoDark        = tc(theme.brandInfo).darken(6.7).toHexString()
theme.brandInfoLight       = tc(theme.brandInfo).lighten(6.7).toHexString()
theme.brandInfoLighter     = tc(theme.brandInfo).lighten(13.5).toHexString()
theme.brandInfoLightest    = tc(theme.brandInfo).lighten(20).toHexString()
theme.brandInfoFade     = tc(theme.brandInfo).setAlpha(0.7).toRgbString()
theme.brandInfoFader    = tc(theme.brandInfo).setAlpha(0.5).toRgbString()
theme.brandInfoFadest   = tc(theme.brandInfo).setAlpha(0.3).toRgbString()

theme.brandWarningDarkest  = tc(theme.brandWarning).darken(20).toHexString()
theme.brandWarningDarker   = tc(theme.brandWarning).darken(13.5).toHexString()
theme.brandWarningDark     = tc(theme.brandWarning).darken(6.7).toHexString()
theme.brandWarningLight    = tc(theme.brandWarning).lighten(6.7).toHexString()
theme.brandWarningLighter  = tc(theme.brandWarning).lighten(13.5).toHexString()
theme.brandWarningLightest = tc(theme.brandWarning).lighten(20).toHexString()
theme.brandWarningFade     = tc(theme.brandWarning).setAlpha(0.7).toRgbString()
theme.brandWarningFader    = tc(theme.brandWarning).setAlpha(0.5).toRgbString()
theme.brandWarningFadest   = tc(theme.brandWarning).setAlpha(0.3).toRgbString()

theme.brandErrorDarkest   = tc(theme.brandError).darken(20).toHexString()
theme.brandErrorDarker    = tc(theme.brandError).darken(13.5).toHexString()
theme.brandErrorDark      = tc(theme.brandError).darken(6.7).toHexString()
theme.brandErrorLight     = tc(theme.brandError).lighten(6.7).toHexString()
theme.brandErrorLighter   = tc(theme.brandError).lighten(13.5).toHexString()
theme.brandErrorLightest  = tc(theme.brandError).lighten(20).toHexString()
theme.brandErrorFade     = tc(theme.brandError).setAlpha(0.7).toRgbString()
theme.brandErrorFader    = tc(theme.brandError).setAlpha(0.5).toRgbString()
theme.brandErrorFadest   = tc(theme.brandError).setAlpha(0.3).toRgbString()

theme.calendarInCinemas = '#35c5f4'
theme.calendarAnnounced = '#337ab7'
theme.calendarDownloading = '#7932ea'
theme.calendarMissing = '#d9534f'
theme.calendarDownloaded = '#5cb85c'
theme.calendarUnmonitored = '#272727'

////////////////
// Typography //
////////////////
theme.fontColor         = '#FFFFFF'
theme.fontColorFade     = tc(theme.fontColor).setAlpha(0.7).toRgbString()
theme.fontColorFader    = tc(theme.fontColor).setAlpha(0.5).toRgbString()
theme.fontColorFadest   = tc(theme.fontColor).setAlpha(0.3).toRgbString()
theme.fontColorDark     = tc(theme.fontColor).darken(20).toHexString()
theme.fontColorDarker   = tc(theme.fontColor).darken(44.7).toHexString()
theme.fontColorDarkest  = tc(theme.fontColor).darken(73.5).toHexString()

theme.fontSize = 15
theme.fontSizeXx = Math.ceil(theme.fontSize * 1.8)
theme.fontSizeXl = Math.ceil(theme.fontSize * 1.5)
theme.fontSizeLg = Math.ceil(theme.fontSize * 1.25)
theme.fontSizeSm = Math.ceil(theme.fontSize * 0.85)
theme.fontSizeXs = Math.ceil(theme.fontSize * 0.7)
theme.fontSizeSs = Math.ceil(theme.fontSize * 0.5)

theme.fontSizeH1 = Math.floor(theme.fontSize * 2.6)
theme.fontSizeH2 = Math.floor(theme.fontSize * 2.15)
theme.fontSizeH3 = Math.ceil(theme.fontSize * 1.7)
theme.fontSizeH4 = Math.ceil(theme.fontSize * 1.25)
theme.fontSizeH5 = theme.fontSize
theme.fontSizeH6 = Math.ceil(theme.fontSize * 0.85)

/////////////
// General //
/////////////
theme.grid = 24

theme.appBarHeight = Platform.OS === 'ios' ? 44 : 56
theme.statusBarHeight = Platform.OS === 'ios' ? 20 : 0

theme.bodyPadding = theme.grid / 4
theme.bodyBg = '#141517'

theme.bodyBgDarkest     = tc(theme.bodyBg).darken(33.5).toHexString()
theme.bodyBgDarker      = tc(theme.bodyBg).darken(20).toHexString()
theme.bodyBgDark        = tc(theme.bodyBg).darken(13.5).toHexString()
theme.bodyBgDarkish     = tc(theme.bodyBg).darken(5).toHexString()
theme.bodyBgDarkisher   = tc(theme.bodyBg).darken(3.5).toHexString()
theme.bodyBgDarkishest  = tc(theme.bodyBg).darken(2).toHexString()
theme.bodyBgLightish    = tc(theme.bodyBg).lighten(5).toHexString()
theme.bodyBgLight       = tc(theme.bodyBg).lighten(13.5).toHexString()
theme.bodyBgLighter     = tc(theme.bodyBg).lighten(20).toHexString()
theme.bodyBgLightest    = tc(theme.bodyBg).lighten(33.5).toHexString()

theme.statusBarBg    = tc(theme.bodyBg).lighten(9).toHexString()
theme.statusBarStyle = 'light-content' // dark-content or light-content, opposing the background color

theme.headerBg                = tc(theme.bodyBg).lighten(9).toHexString()
theme.headerFontColor         = theme.fontColor
theme.headerPressColorAndroid = theme.brandPrimary

theme.scrollBarStyle = 'white'
theme.keyboardAppearance = 'dark'

theme.listItemBg          = tc(theme.bodyBg).lighten(4).toHexString()
theme.listItemFontColor   = theme.fontColor
theme.listItemHeight      = Math.floor(theme.grid * 2.5)

theme.listItemSeparatorBg     = theme.bodyBg
theme.listItemSeparatorHeight = StyleSheet.hairlineWidth

theme.inputFontColor    = theme.fontColor
theme.inputFontSize     = theme.fontSize
theme.inputPaddingH     = theme.grid / 2
theme.inputBg           = tc(theme.bodyBg).lighten(7.7).toHexString()
theme.inputBgHeader     = tc(theme.headerBg).darken(7.7).toHexString()
theme.inputKeyboardType = Platform.OS === 'ios' ? 'url' : 'email-address'

theme.movieCard   = { width: 100, height: 150 }
theme.moviePoster = { width: 200, height: 300 }

theme.notificationHeight      = theme.statusBarHeight || 20
theme.notificationTopDistance = theme.appBarHeight + theme.statusBarHeight

theme.touchableActiveOpacity = 0.55

theme.keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? 'padding' : undefined

///////////////////
// Props & Style //
///////////////////
// Use: {...theme.props.input}
theme.props = {}
// Use: style={[ theme.style.input, style.input ]}. This will become a StyleSheet style reference
theme.style = {}

/////////////
// General //
/////////////
theme.style.hasNotification = {
  marginTop: theme.notificationHeight,
}

theme.style.headerTransparent = {
  position         : 'absolute',
  backgroundColor  : 'transparent',
  zIndex           : 100,
  top              : 0,
  left             : 0,
  right            : 0,
  borderBottomColor: 'transparent',
  borderBottomWidth: 0,
  elevation        : 0,
  shadowColor      : 'transparent',
  shadowRadius     : 0,
  shadowOffset     : { height: 0 },
}

////////////
// Button //
////////////
theme.style.button = {
  paddingVertical: theme.grid / 2,
  backgroundColor: theme.brandDefault,
}
theme.style.buttonPrimary = { ...theme.style.button, backgroundColor: theme.brandPrimary }
theme.style.buttonSuccess = { ...theme.style.button, backgroundColor: theme.brandSuccess }
theme.style.buttonInfo = { ...theme.style.button, backgroundColor: theme.brandInfoDarker }
theme.style.buttonWarning = { ...theme.style.button, backgroundColor: theme.brandWarning }
theme.style.buttonError = { ...theme.style.button, backgroundColor: theme.brandError }

///////////
// Input //
///////////
theme.props.input = {
  autoCapitalize       : 'none',
  autoCorrect          : false,
  underlineColorAndroid: 'transparent',
  keyboardAppearance   : theme.keyboardAppearance,
  placeholderTextColor : theme.fontColorFadest,
  numberOfLines        : 1,
}
theme.style.input = {
  color            : theme.inputFontColor,
  fontSize         : theme.inputFontSize,
  backgroundColor  : theme.inputBg,
  paddingHorizontal: theme.inputPaddingH,
  height           : theme.listItemHeight,
}

/////////////
// Spinner //
/////////////
theme.props.spinner = {
  color: theme.fontColor,
  size : Platform.OS === 'ios' ? 1 : theme.fontSizeXl,
}

///////////////
// StatusBar //
///////////////
theme.props.statusBar = {
  backgroundColor: theme.statusBarBg,
  barStyle       : theme.statusBarStyle,
}

////////////
// Switch //
////////////
theme.props.switch = {
  tintColor     : theme.brandDefault,
  onTintColor   : theme.brandPrimary,
  thumbTintColor: null,
}

//////////
// Text //
//////////
theme.style.text = {
  color   : theme.fontColor,
  fontSize: theme.fontSize,
}

theme.style.textHeaderIcon = {
  color   : theme.fontColor,
  fontSize: theme.fontSizeXl,
}

theme.style.textHeaderIconBack = {
  fontSize: theme.fontSizeXx,
}

theme.style.textButton = {
  color     : theme.fontColor,
  fontSize  : theme.fontSize,
  fontWeight: 'bold',
  textAlign : 'center',
}

theme.style.textLoading = {
  color   : theme.fontColorFade,
  fontSize: theme.fontSize,
}

theme.props.selectable = {
  selectable    : true,
  selectionColor: theme.brandPrimary,
}

theme.props.oneLine = {
  numberOfLines: 1,
  ellipsizeMode: 'tail',
}

theme.props.twoLine = {
  numberOfLines: 2,
  ellipsizeMode: 'tail',
}

theme.props.threeLine = {
  numberOfLines: 3,
  ellipsizeMode: 'tail',
}

//////////
// View //
//////////
theme.style.viewBody = {
  flex           : 1,
  backgroundColor: theme.bodyBg,
}

theme.style.viewVerticalCenter = {
  flex           : 1,
  flexDirection  : 'column',
  justifyContent : 'center',
  alignItems     : 'center',
  padding        : theme.bodyPadding,
  backgroundColor: theme.bodyBg,
}

theme.style.viewHeaderButtonContainer = {
  flexDirection  : 'row',
  justifyContent : 'flex-start',
  backgroundColor: 'transparent',
}

theme.style.viewHeaderButton = {
  flexDirection    : 'column',
  justifyContent   : 'center',
  alignItems       : 'center',
  height           : theme.appBarHeight,
  paddingHorizontal: Math.floor(theme.grid / 1.5),
}

theme.style.itemSeparator = {
  flex           : 0,
  height         : StyleSheet.hairlineWidth,
  backgroundColor: theme.listItemSeparatorBg,
}

////////////////
// StyleSheet //
////////////////
theme.style = StyleSheet.create(theme.style)

export default theme
