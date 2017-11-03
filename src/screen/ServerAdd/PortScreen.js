/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { Dimensions, KeyboardAvoidingView, Text, TextInput, View } from 'react-native'

/////////////////
// Third-party //
/////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { debounce } from 'throttle-debounce'
import isEqual from 'lodash.isequal'

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
class PortScreen extends React.Component {
  static displayName = 'PortScreen'

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
    isLandscape: false,
  }

  componentWillMount = () => {
    this._onChangeOrientation(
      { screen: Dimensions.get('screen') },
      {
        _onPressNext      : this._onPressNext,
        _onPressSaveServer: this._onPressSaveServer,
        server            : { ...this.props.navigation.state.params.server, port: config.radarrPort },
      }
    )
    Dimensions.addEventListener('change', this._onChangeOrientation)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      if(__DEV__) console.log('Render', 'ServerAdd', 'currentRoute')
      return true
    }
    return false
  }

  componentWillUnmount = () => Dimensions.removeEventListener('change', this._onChangeOrientation)

  _onChangeOrientation = ({ screen: { width, height } }, navParams) => {
    try {
      const isLandscape = height < width
      this.props.navigation.setParams({ ...navParams, isLandscape })
      this.setState({ isLandscape })
    } catch (e) {
      //
    }
  }

  _onPressNext = () => {
    if (this._isValid()) {
      const { navigation: { navigate, state: { params: { server } } } } = this.props
      navigate('UrlBaseScreen', { server })
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
    const { state: { isLandscape }, props: { setNotification, navigation: { state: { params: { server: { port } } } } } } = this

    if (!port || port.length === 0) {
      setNotification({ type: 'error', statusBar: isLandscape, message: localization.t('errorPortCannotBeEmpty') })
      return false
    }
    if (!config.regex.port.test(port)) {
      setNotification({ type: 'error', statusBar: isLandscape, message: localization.t('errorPortIsInvalid') })
      return false
    }

    return true
  }

  _onChangeText = port => {
    if (!port) {
      this.props.navigation.setParams({ server: { ...this.props.navigation.state.params.server, port: '' } })
      return
    }
    if (config.regex.port.test(port)) {
      this.props.navigation.setParams({ server: { ...this.props.navigation.state.params.server, port: parseInt(port) } })
    }
  }

  render = () => {
    const { state: { isLandscape }, props: { hasNotificationStyle, navigation: { state: { params: { isEditing, server: { port } } } } } } = this
    return (
      <KeyboardAvoidingView
        behavior={theme.keyboardAvoidingViewBehavior}
        style={[ style.container, hasNotificationStyle, isLandscape && style.containerLandscape ]}
      >
        <Text style={[ theme.style.text, style.label ]}>{localization.t('port')}</Text>
        <Text style={[ theme.style.text, style.helper ]}>{localization.t('helperTextForPort')}</Text>
        <TextInput
          {...theme.props.input}
          style={[ theme.style.input, style.input ]}
          autoCapitalize='none'
          autoFocus={true}
          keyboardType={'numeric'}
          returnKeyType={isEditing ? 'done' : 'next'}
          value={(typeof port === 'undefined' ? config.radarrPort : port).toString()}
          onChangeText={this._onChangeText}
          onSubmitEditing={isEditing ? this._onPressSaveServer : this._onPressNext}
          blurOnSubmit={false}
        />
      </KeyboardAvoidingView>
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
  screen: connect(mapStateToProps, mapDispatchToProps)(PortScreen),

  navigationOptions: {},
}
