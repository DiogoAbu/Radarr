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
class UrlBaseScreen extends React.Component {
  static displayName = 'UrlBaseScreen'

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
    this._onChangeOrientation({ screen: Dimensions.get('screen') }, { _onPressNext: this._onPressNext, _onPressSaveServer: this._onPressSaveServer })
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
      navigate('SslScreen', { server })
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

  _isValid = () => true

  _onChangeText = urlBase => this.props.navigation.setParams({ server: { ...this.props.navigation.state.params.server, urlBase } })

  render = () => {
    const { state: { isLandscape }, props: { hasNotificationStyle, navigation: { state: { params: { isEditing, server: { urlBase } } } } } } = this
    return (
      <KeyboardAvoidingView
        behavior={theme.keyboardAvoidingViewBehavior}
        style={[ style.container, hasNotificationStyle, isLandscape && style.containerLandscape ]}
      >
        <Text style={[ theme.style.text, style.label ]}>{localization.t('urlBase')}</Text>
        <Text style={[ theme.style.text, style.helper ]}>{localization.t('helperTextForUrlBase')}</Text>
        <TextInput
          {...theme.props.input}
          style={[ theme.style.input, style.input ]}
          autoCapitalize='none'
          autoFocus={true}
          keyboardType={theme.inputKeyboardType}
          returnKeyType={isEditing ? 'done' : 'next'}
          value={urlBase}
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
  screen: connect(mapStateToProps, mapDispatchToProps)(UrlBaseScreen),

  navigationOptions: {},
}
