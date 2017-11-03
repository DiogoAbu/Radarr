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
import { Text } from 'react-native'

/////////////////
// Third-party //
/////////////////
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable'
import typechecker from 'typechecker'

////////////
// Custom //
////////////
import style from './ListItem.style'

import { theme } from 'src/constant'
import { TouchableItem } from 'src/component'

//////////
// Init //
//////////
const IconAnimatable = Animatable.createAnimatableComponent(Icon)

const defaultAnim = {
  animation     : 'rotate',
  duration      : 2000,
  easing        : 'linear',
  iterationCount: 'infinite',
}

const presets = {
  bounce: {
    animation: {
      from: { translateY: -5 },
      to  : { translateY: 5 },
    },
    duration : 1000,
    easing   : 'ease-in-out',
    direction: 'alternate',
  },
}

// NOTE: onPress is overridden by onLongPress when debugger is enabled (react-native/issues/4944)
export default class ListItem extends React.PureComponent {
  static propTypes = {
    return     : PropTypes.any,
    disabled   : PropTypes.any,
    onPress    : PropTypes.func,
    onLongPress: PropTypes.func,

    styleContainer: PropTypes.any,

    height: PropTypes.any,

    center           : PropTypes.any,
    styleCenter      : PropTypes.any,
    styleTextCenter  : PropTypes.any,
    returnCenter     : PropTypes.any,
    onPressCenter    : PropTypes.func,
    onLongPressCenter: PropTypes.func,

    left           : PropTypes.any,
    styleLeft      : PropTypes.any,
    animateLeft    : PropTypes.any,
    returnLeft     : PropTypes.any,
    onPressLeft    : PropTypes.func,
    onLongPressLeft: PropTypes.func,

    right           : PropTypes.any,
    styleRight      : PropTypes.any,
    animateRight    : PropTypes.any,
    returnRight     : PropTypes.any,
    onPressRight    : PropTypes.func,
    onLongPressRight: PropTypes.func,
  }

  constructor(props) {
    super(props)

    this.isDisabled =
      this.props.disabled ||
      (!typechecker.isFunction(this.props.onPress) && !typechecker.isFunction(this.props.onLongPress)) ||
      typechecker.isFunction(this.props.onPressLeft) ||
      typechecker.isFunction(this.props.onLongPressLeft) ||
      typechecker.isFunction(this.props.onPressCenter) ||
      typechecker.isFunction(this.props.onLongPressCenter) ||
      typechecker.isFunction(this.props.onPressRight) ||
      typechecker.isFunction(this.props.onLongPressRight)
  }

  _onPress = () => typechecker.isFunction(this.props.onPress) && this.props.onPress(this.props.return)
  _onLongPress = !this.props.onLongPress ? null : () => typechecker.isFunction(this.props.onLongPress) && this.props.onLongPress(this.props.return)

  _onPressCenter = () => typechecker.isFunction(this.props.onPressCenter) && this.props.onPressCenter(this.props.returnCenter || this.props.return)
  _onLongPressCenter = !this.props.onLongPressCenter
    ? null
    : () => typechecker.isFunction(this.props.onLongPressCenter) && this.props.onLongPressCenter(this.props.returnCenter || this.props.return)

  _onPressLeft = () => typechecker.isFunction(this.props.onPressLeft) && this.props.onPressLeft(this.props.returnLeft || this.props.return)
  _onLongPressLeft = !this.props.onLongPressLeft
    ? null
    : () => typechecker.isFunction(this.props.onLongPress) && this.props.onLongPress(this.props.returnLeft || this.props.return)

  _onPressRight = () => typechecker.isFunction(this.props.onPressRight) && this.props.onPressRight(this.props.returnRight || this.props.return)
  _onLongPressRight = !this.props.onLongPressRight
    ? null
    : () => typechecker.isFunction(this.props.onLongPressRight) && this.props.onLongPressRight(this.props.returnRight || this.props.return)

  _getAnimation = animProps => {
    if (!animProps) return {}

    if (typechecker.isString(animProps)) {
      return { ...defaultAnim, ...presets[animProps] }
    }
    if (typechecker.isObject(animProps)) {
      return { ...defaultAnim, ...animProps }
    }
    return defaultAnim
  }

  _renderIcon = ({ component, animProps, textStyle, iconStyle, iconFallback }) => {
    const WhichIcon = animProps ? IconAnimatable : Icon

    if (typechecker.isString(component)) {
      return (
        <Text
          {...theme.props.selectable}
          {...theme.props.twoLine}
          style={[ theme.style.text, style.item, textStyle ]}
        >
          {component}
        </Text>
      )
    }

    if (typechecker.isObject(component) && component.name) {
      return (
        <WhichIcon
          style={[ style.item, iconStyle, component.color && { color: component.color }, component.size && { fontSize: component.size } ]}
          name={component.name}
          {...this._getAnimation(animProps)}
        />
      )
    }

    if (iconFallback) {
      return (<WhichIcon
        style={[ style.item, iconStyle ]}
        name='chevron-right'
        {...this._getAnimation(animProps)}
      />)
    }

    return component
  }

  _renderCenter = () => {
    const { center } = this.props

    if (typechecker.isString(center)) {
      return (
        <Text
          {...theme.props.selectable}
          {...theme.props.twoLine}
          style={[ theme.style.text, style.item, style.textCenter, this.props.styleTextCenter ]}
        >
          {center}
        </Text>
      )
    }

    if (typechecker.isArray(center)) {
      return center.map(item => ({
        ...item,
        ...theme.props.selectable,
        ...theme.props.oneLine,
        style: [ theme.style.text, style.item, item.style ],
      }))
    }

    return center
  }

  render = () => (
    <TouchableItem
      useForeground={true}
      onPress={this._onPress}
      onLongPress={this._onLongPress}
      disabled={this.isDisabled}
      style={[ style.container, { height: this.props.height || theme.listItemHeight }, this.props.style ]}
    >
      {this.props.left && (
        <TouchableItem
          disabled={this.props.disabledLeft || (!typechecker.isFunction(this.props.onPressLeft) && !typechecker.isFunction(this.props.onLongPressLeft))}
          onPress={this._onPressLeft}
          onLongPress={this._onLongPressLeft}
          style={[ style.left, { height: this.props.height || theme.listItemHeight }, this.props.styleLeft ]}
        >
          {this._renderIcon({
            component: this.props.left,
            animProps: this.props.animateLeft,
            textStyle: [ style.textLeft, this.props.styleTextLeft ],
            iconStyle: style.icon,
          })}
        </TouchableItem>
      )}

      {this.props.center && (
        <TouchableItem
          disabled={this.props.disabledCenter || (!typechecker.isFunction(this.props.onPressCenter) && !typechecker.isFunction(this.props.onLongPressCenter))}
          onPress={this._onPressCenter}
          onLongPress={this._onLongPressCenter}
          style={[
            style.center,
            { height: this.props.height || theme.listItemHeight },
            !this.props.left && style.centerNoLeft,
            typechecker.isNull(this.props.right) && style.centerNoRight,
            this.props.styleCenter,
          ]}
        >
          {this._renderCenter()}
        </TouchableItem>
      )}

      {!typechecker.isNull(this.props.right) && (
        <TouchableItem
          disabled={this.props.disabledRight || (!typechecker.isFunction(this.props.onPressRight) && !typechecker.isFunction(this.props.onLongPressRight))}
          onPress={this._onPressRight}
          onLongPress={this._onLongPressRight}
          style={[ style.right, { height: this.props.height || theme.listItemHeight }, this.props.styleRight ]}
        >
          {this._renderIcon({
            component   : this.props.right,
            animProps   : this.props.animateRight,
            textStyle   : [ style.textRight, this.props.styleTextRight ],
            iconStyle   : style.go,
            iconFallback: typechecker.isUndefined(this.props.right),
          })}
        </TouchableItem>
      )}
    </TouchableItem>
  )
}
