/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { Dimensions, Text, View } from 'react-native'

/////////////////
// Third-party //
/////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { debounce } from 'throttle-debounce'
import isEqual from 'lodash.isequal'

import Carousel from 'react-native-snap-carousel'
import { ColorPicker, fromHsv } from 'react-native-color-picker'
import hexColorRegex from 'hex-color-regex'

////////////
// Custom //
////////////
import { appAction, appSelector, serverAction, serverSelector } from 'src/reducer'

import style from './sharedStyle'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { TouchableItem } from 'src/component'

//////////
// Init //
//////////
const ICON_INDEX = Math.ceil(config.availableIcon.length / 2)
const ICON_COLOR = theme.brandPrimaryLight
const SLIDER_WIDTH_V = theme.fontSizeXx * 2 * 4
const ITEM_WIDTH = theme.fontSizeXx * 2 * 1.5
const ITEM_HEIGHT = theme.fontSizeXx * 2 * 1.5
const regexColor = hexColorRegex({ strict: true })

class IconScreen extends React.Component {
  static displayName = 'IconScreen'

  static navigationOptions = props => {
    const { navigation, navigation: { state: { params: { server, isEditing, isLandscape, _onPressNext, _onPressSaveServer } } } } = props

    return {
      title      : isEditing ? localization.t('serverEditName', { name: server.name }) : localization.t('serverAdd'),
      headerTitle: isLandscape && '',
      headerLeft : (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={() => navigation.goBack()}
          >
            <Icon
              style={[ theme.style.textHeaderIcon, theme.style.textHeaderIconBack ]}
              name='chevron-left'
            />
          </TouchableItem>
        </View>
      ),
      headerRight: isEditing ? (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={_onPressSaveServer}
          >
            <Text style={theme.style.text}>{localization.t('save')}</Text>
          </TouchableItem>
        </View>
      ) : (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={_onPressNext}
          >
            <Text style={theme.style.text}>{localization.t('next')}</Text>
          </TouchableItem>
        </View>
      ),
      headerStyle: theme.style.headerTransparent,
    }
  }

  constructor(props) {
    super(props)
    this._onPressNext = debounce(config.debounceTime, true, this._onPressNext)
    this._onPressSaveServer = debounce(config.debounceTime, true, this._onPressSaveServer)
  }

  state = {
    isLandscape : false,
    screenWidth : 0,
    screenHeight: 0,
  }

  componentWillMount = () => {
    const { navigation: { state: { params: { server } } } } = this.props

    this._onChangeOrientation(
      { screen: Dimensions.get('screen') },
      {
        _onPressNext      : this._onPressNext,
        _onPressSaveServer: this._onPressSaveServer,
        server            : {
          ...server,
          icon     : server.icon ? server.icon : config.availableIcon[ICON_INDEX],
          iconColor: server.iconColor ? server.iconColor : ICON_COLOR,
        },
      }
    )
    Dimensions.addEventListener('change', this._onChangeOrientation)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'ServerAdd', 'currentRoute')
      return true
    }
    return false
  }

  componentWillUnmount = () => Dimensions.removeEventListener('change', this._onChangeOrientation)

  _onChangeOrientation = ({ screen: { width, height } }, navParams) => {
    try {
      const isLandscape = height < width
      this.props.navigation.setParams({ ...navParams, isLandscape })
      this.setState({ isLandscape, screenWidth: width, screenHeight: height })
    } catch (e) {
      //
    }
  }

  _onPressNext = () => {
    if (this._isValid()) {
      const { navigation: { navigate, state: { params: { server } } } } = this.props
      navigate('HostScreen', { server })
    }
  }

  _onPressSaveServer = () => {
    if (this._isValid()) {
      const { props: { storeServer, navigation, navigation: { state: { params: { server, isEditing } } } } } = this
      isEditing(server)
      storeServer(server)
      navigation.goBack()
    }
  }

  _isValid = () => {
    const { state: { isLandscape }, props: { setNotification, navigation: { state: { params: { server: { icon, iconColor } } } } } } = this

    if (!icon || icon.length === 0) {
      setNotification({ type: 'error', statusBar: isLandscape, message: localization.t('errorIconCannotBeEmpty') })
      return false
    }
    if (!config.availableIcon.includes(icon)) {
      setNotification({ type: 'error', statusBar: isLandscape, message: localization.t('errorIconChooseAnIcon') })
      return false
    }
    if (!iconColor || iconColor.length === 0) {
      setNotification({ type: 'error', statusBar: isLandscape, message: localization.t('errorIconColorCannotBeEmpty') })
      return false
    }
    if (!regexColor.test(iconColor)) {
      setNotification({ type: 'error', statusBar: isLandscape, message: localization.t('errorIconColorNotAValidColor') })
      return false
    }

    return true
  }

  _onChangeIcon = slideIndex =>
    this.props.navigation.setParams({ server: { ...this.props.navigation.state.params.server, icon: config.availableIcon[slideIndex] } })

  _onChangeIconColor = hsv => this.props.navigation.setParams({ server: { ...this.props.navigation.state.params.server, iconColor: fromHsv(hsv) } })

  _renderItemIcon = ({ item: icon, index }) => (
    <TouchableItem
      style={style.iconContainer}
      onPress={() => this._carousel.snapToItem(index)}
    >
      <Icon
        style={[ theme.style.text, style.icon, { color: this.props.navigation.state.params.server.iconColor || ICON_COLOR } ]}
        name={icon}
      />
    </TouchableItem>
  )

  render = () => {
    const {
      state: { isLandscape, screenWidth, screenHeight },
      props: { hasNotificationStyle, navigation: { state: { params: { server: { icon, iconColor } } } } },
    } = this
    return (
      <View style={[ style.container, hasNotificationStyle, isLandscape && style.containerLandscape ]}>
        <Text style={[ theme.style.text, style.label, style.labelIcon, isLandscape && style.labelIconLandscape ]}>{localization.t('icon')}</Text>
        <View style={isLandscape ? style.innerContainerLandscape : style.innerContainer}>
          <Carousel
            ref={carousel => (this._carousel = carousel)}
            data={config.availableIcon}
            extraData={iconColor || ICON_COLOR}
            renderItem={this._renderItemIcon}
            firstItem={icon ? config.availableIcon.findIndex(e => e === icon) : ICON_INDEX}
            sliderWidth={isLandscape ? SLIDER_WIDTH_V : screenWidth}
            sliderHeight={isLandscape ? screenHeight : SLIDER_WIDTH_V}
            itemWidth={ITEM_WIDTH}
            itemHeight={ITEM_HEIGHT}
            vertical={isLandscape}
            enableSnap={true}
            enableMomentum={true}
            decelerationRate={0.9}
            inactiveSlideOpacity={0.67}
            inactiveSlideScale={0.7}
            slideStyle={isLandscape && { alignSelf: 'center' }}
            containerCustomStyle={[ style.carousel, isLandscape && style.carouselLandscape ]}
            onSnapToItem={this._onChangeIcon}
          />

          <ColorPicker
            style={[ style.colorPicker, isLandscape && style.colorPickerLandscape ]}
            defaultColor={iconColor || ICON_COLOR}
            oldColor={iconColor || ICON_COLOR}
            onColorSelected={this._onChangeIconColor}
            onOldColorSelected={this._onChangeIconColor}
            hideSliders={false}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = state => ({
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  const appBinded = bindActionCreators(appAction, dispatch)
  const serverBinded = bindActionCreators(serverAction, dispatch)
  return {
    dispatch,
    storeServer    : serverSelector.storeAction(serverBinded),
    setNotification: appSelector.setNotificationAction(appBinded),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(IconScreen),

  navigationOptions: {},
}
