/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'

/////////////////
// Third-party //
/////////////////
import { StackNavigator, TabNavigator } from 'react-navigation'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'

////////////
// Custom //
////////////
import { config, theme } from 'src/constant'

import { MoreIndex, DiskspaceScreen, NotificationScreen, SystemStatusScreen } from 'src/screen/MoreIndex'

import { MovieDetail } from 'src/screen/MovieDetail'
import { MovieEdit } from 'src/screen/MovieEdit'
import { MovieIndex } from 'src/screen/MovieIndex'

import { QueueIndex } from 'src/screen/QueueIndex'

import { WantedIndex } from 'src/screen/WantedIndex'

//////////
// Init //
//////////
const screen = {
  Movie: {
    screen           : StackNavigator({ MovieDetail, MovieEdit, MovieIndex }, { ...config.navigator.stack, initialRouteName: 'MovieIndex' }),
    navigationOptions: {
      tabBarIcon: <Icon
        style={{ color: theme.fontColor, fontSize: theme.fontSizeLg }}
        name='movie'
      />,
    },
  },

  Queue: {
    screen           : StackNavigator({ QueueIndex }, { ...config.navigator.stack, initialRouteName: 'QueueIndex' }),
    navigationOptions: {
      tabBarIcon: <Icon
        style={{ color: theme.fontColor, fontSize: theme.fontSizeLg }}
        name='clock'
      />,
    },
  },

  Wanted: {
    screen           : StackNavigator({ WantedIndex }, { ...config.navigator.stack, initialRouteName: 'WantedIndex' }),
    navigationOptions: {
      tabBarIcon: <Icon
        style={{ color: theme.fontColor, fontSize: theme.fontSizeLg }}
        name='alert'
      />,
    },
  },

  More: {
    screen           : StackNavigator({ MoreIndex, DiskspaceScreen, NotificationScreen, SystemStatusScreen }, { ...config.navigator.stack, initialRouteName: 'MoreIndex' }),
    navigationOptions: {
      tabBarIcon: <Icon
        style={{ color: theme.fontColor, fontSize: theme.fontSizeLg }}
        name='menu'
      />,
    },
  },
}

export default {
  screen: TabNavigator(screen, { ...config.navigator.tab, initialRouteName: 'Movie' }),

  navigationOptions: {
    header: null,
  },
}
