/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////

/////////////////
// Third-party //
/////////////////
import { StackNavigator } from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'

////////////
// Custom //
////////////
import { config } from 'src/constant'

import { NameScreen, IconScreen, HostScreen, PortScreen, UrlBaseScreen, SslScreen, ApiKeyScreen } from 'src/screen/ServerAdd'

import { ServerEdit } from 'src/screen/ServerEdit'
import { ServerIndex } from 'src/screen/ServerIndex'

//////////
// Init //
//////////
const screen = {
  NameScreen,
  IconScreen,
  HostScreen,
  PortScreen,
  UrlBaseScreen,
  SslScreen,
  ApiKeyScreen,

  ServerEdit,
  ServerIndex,
}

export default {
  screen: StackNavigator(screen, {
    ...config.navigator.stack,
    initialRouteName: 'ServerIndex',
    transitionConfig: () => ({ screenInterpolator: CardStackStyleInterpolator.forHorizontal }),
  }),

  navigationOptions: {
    header: null,
  },
}
