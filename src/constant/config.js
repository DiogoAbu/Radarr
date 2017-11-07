/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import { Platform } from 'react-native'
import { FileSystem } from 'expo'

/////////////////
// Third-party //
/////////////////

////////////
// Custom //
////////////
import theme from './theme'

//////////
// Init //
//////////
const config = {
  radarrPort: 7878,

  moviePerPage             : 20,
  movieInitialNumToRender  : 5,
  movieArrayHorizontalTotal: 10,
  movieLocalSearchLimit    : 10,

  queuePerPage           : 25,
  queueInitialNumToRender: 5,

  wantedPerPage           : 25,
  wantedInitialNumToRender: 5,
  wantedGetPageSize       : -1,

  historyPerPage           : 25,
  historyInitialNumToRender: 5,
  historyGetPageSize       : 100,

  calendarYearPeriod: 3,

  notificationMaxToStore : 25,
  notificationTimeout    : 4000,
  notificationTypeDefault: 'default',
  notificationTypeArray  : [ 'default', 'success', 'info', 'warning', 'error' ],

  mediaCover: {
    root: `${FileSystem.documentDirectory}mediaCover`,
    ext : 'jpg',
  },
  mediaCoverConcurrency         : 4,
  limitToAlertMediaCoverDownload: 5,

  youtubeVideoLink: 'https://youtu.be/',
  imdbMovieLink   : 'http://www.imdb.com/title/',
  tmdbMovieLink   : 'https://www.themoviedb.org/movie/',

  nameMaxLen: 20,

  debounceTime: 500,

  availableIcon: [
    'server',
    'server-off',
    'server-minus',
    'server-network',
    'server-network-off',
    'server-security',
    'linux',
    'ubuntu',
    'microsoft',
    'windows',
    'laptop-windows',
    'apple',
    'desktop-mac',
    'laptop-mac',
    'android',
    'android-debug-bridge',
    'raspberrypi',
  ],

  timeout: 5000,

  poster: {
    width : 300,
    height: 450,
  },

  banner: {
    width : 960,
    height: 540,
  },

  storageKey: {
    server       : 'radarr@letsmakeapps/server',
    notification : 'radarr@letsmakeapps/notification',
    locale       : 'radarr@letsmakeapps/locale',
    movie        : 'radarr@letsmakeapps/movie',
    profile      : 'radarr@letsmakeapps/profile',
    queue        : 'radarr@letsmakeapps/queue',
    history      : 'radarr@letsmakeapps/history',
    wantedMissing: 'radarr@letsmakeapps/wantedMissing',
    calendar     : 'radarr@letsmakeapps/calendar',
    diskspace    : 'radarr@letsmakeapps/diskspace',
    systemStatus : 'radarr@letsmakeapps/systemStatus',
  },

  regex: {
    port  : new RegExp('^([1-9]\\d{0,3}|0|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$'),
    apiKey: new RegExp('[a-z0-9]{32}'),
  },

  navigator: {
    stack: {
      headerMode: 'screen',
      cardStyle : {
        backgroundColor: theme.bodyBg,
      },
      navigationOptions: {
        gesturesEnabled: false,
        headerStyle    : {
          backgroundColor: theme.headerBg,
        },
        headerTintColor        : theme.headerFontColor,
        headerPressColorAndroid: theme.headerPressColorAndroid,
        headerTitleStyle       : undefined,
      },
    },

    tab: {
      lazy          : true,
      tabBarPosition: 'bottom',
      tabBarOptions :
        Platform.OS === 'ios'
          ? {
            activeTintColor        : theme.fontColor,
            activeBackgroundColor  : theme.brandPrimary,
            inactiveTintColor      : theme.fontColorFadest,
            inactiveBackgroundColor: undefined,
            showLabel              : false,
            tabStyle               : undefined,
            labelStyle             : undefined,
            style                  : { backgroundColor: theme.headerBg },
          }
          : {
            activeTintColor  : theme.fontColor,
            inactiveTintColor: theme.fontColorFadest,
            showIcon         : true,
            showLabel        : false,
            upperCaseLabel   : true,
            pressColor       : theme.headerPressColorAndroid,
            pressOpacity     : 0.7,
            scrollEnabled    : false,
            tabStyle         : undefined,
            indicatorStyle   : { backgroundColor: theme.brandPrimary },
            labelStyle       : undefined,
            iconStyle        : undefined,
            style            : { backgroundColor: theme.headerBg },
          },
    },
  },
}

export default config
