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
import { Platform, TouchableNativeFeedback, TouchableOpacity, View } from 'react-native'

/////////////////
// Third-party //
/////////////////

////////////
// Custom //
////////////
import { theme } from 'src/constant'
import { localization } from 'src/localization'

//////////
// Init //
//////////
const ANDROID_VERSION_LOLLIPOP = 21
const defaultProps = {
  accessibilityComponentType: 'button',
  accessibilityLabel        : localization.t('back'),
  accessibilityTraits       : 'button',
  delayPressIn              : 0,
  delayLongPress            : 350,
  pressColor                : theme.headerPressColorAndroid,
  borderless                : true,
  useForeground             : false,
  activeOpacity             : theme.touchableActiveOpacity,
}

export default class TouchableItem extends React.PureComponent {
  static propTypes = {
    children: PropTypes.any,
    onPress : PropTypes.func,
    // Use TouchableOpacity instead
    noRipple: PropTypes.bool,
  }

  _onPress = (...args) => {
    requestAnimationFrame(() => {
      this.props.onPress(...args)
    })
  }

  render = () => {
    const finalProps = { ...defaultProps, ...this.props }

    // TouchableNativeFeedback.Ripple causes a crash on Android versions lower than Lollipop
    if (this.props.noRipple !== true && Platform.OS === 'android' && Platform.Version >= ANDROID_VERSION_LOLLIPOP) {
      // This is only available on Android 6.0 and above
      if (!TouchableNativeFeedback.canUseNativeForeground()) {
        finalProps.useForeground = false
      }

      const { style, ...rest } = finalProps

      return (
        <TouchableNativeFeedback
          {...rest}
          onPress={(...args) => this._onPress(...args)}
          style={null}
          background={TouchableNativeFeedback.Ripple(finalProps.pressColor, finalProps.borderless)}
        >
          <View style={style}>{React.Children.only(this.props.children)}</View>
        </TouchableNativeFeedback>
      )
    }

    return <TouchableOpacity {...finalProps}>{this.props.children}</TouchableOpacity>
  }
}
