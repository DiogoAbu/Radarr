/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import PropTypes from 'prop-types'
import { Text, View } from 'react-native'

/////////////////
// Third-party //
/////////////////

////////////
// Custom //
////////////
import style from './Tag.style'
import { theme } from 'src/constant'

//////////
// Init //
//////////
export default class Tag extends React.PureComponent {
  static propTypes = {
    brand   : PropTypes.any,
    children: PropTypes.any,
    style   : PropTypes.any,
  }

  render = () => (
    <View
      {...this.props}
      style={[ style.container, this.props.brand ? style[this.props.brand] : null, this.props.style ]}
    >
      <Text
        {...theme.props.selectable}
        style={style.tag}
      >
        {this.props.children}
      </Text>
    </View>
  )
}
