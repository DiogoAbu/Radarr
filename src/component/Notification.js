/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { Text, View } from 'react-native'

/////////////////
// Third-party //
/////////////////

////////////
// Custom //
////////////
import style from './Notification.style'
import { theme } from 'src/constant'

//////////
// Init //
//////////
export default class Notification extends React.PureComponent {
  render = () =>
    this.props.notification.message ? (
      <View style={[ style.container, style[this.props.notification.type], this.props.notification.statusBar && style.statusBarTrue ]}>
        <Text
          {...theme.props.oneLine}
          style={style.message}
        >
          {this.props.notification.message}
        </Text>
      </View>
    ) : null
}
