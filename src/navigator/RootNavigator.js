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

////////////
// Custom //
////////////
import { config } from 'src/constant'

import Radarr from './RadarrNavigator'
import Server from './ServerNavigator'

//////////
// Init //
//////////
const screen = {
  Server,
  Radarr,
}

export default StackNavigator(screen, {
  ...config.navigator.stack,
  initialRouteName: 'Server',
})
