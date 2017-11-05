/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { BackHandler, LayoutAnimation, Modal, StatusBar, View } from 'react-native'

/////////////////
// Third-party //
/////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { addNavigationHelpers, NavigationActions } from 'react-navigation'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import { appAction, appSelector } from 'src/reducer'

import style from './Root.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { Notification } from 'src/component'

import { RootNavigator } from 'src/navigator'

//////////
// Init //
//////////
// TODO Fix performance https://github.com/react-community/react-navigation/issues/608#issuecomment-328635042
class Root extends React.Component {
  static displayName = 'Root'

  // Set current locale to state
  componentWillMount = () => this.props.setCurrentLocale(localization.currentLocale())

  componentDidMount = () => BackHandler.addEventListener('hardwareBackPress', this._onBackPress)

  shouldComponentUpdate(nextProps) {
    if (!isEqual(nextProps.nav, this.props.nav)) {
      console.log('Render', 'Root', 'navigation')
      return true
    }
    if (nextProps.fullscreen !== this.props.fullscreen) {
      console.log('Render', 'Root', 'fullscreen')
      return true
    }
    if (nextProps.notification.message) {
      // If has a previous notification clear it's timeout
      if (this._timer) {
        clearTimeout(this._timer)
      }
      // Set new timeout to remove notification
      this._timer = setTimeout(() => {
        clearTimeout(this._timer)
        this._timer = null
        LayoutAnimation.linear()
        this.props.removeNotification()
      }, config.notificationTimeout)

      console.log('Render', 'Root', 'notification added')
      return true
    }
    if (nextProps.notification.message !== this.props.notification.message) {
      // Will render to remove notification
      console.log('Render', 'Root', 'notification updated')
      return true
    }
    return false
  }

  componentWillUnmount = () => BackHandler.removeEventListener('hardwareBackPress', this._onBackPress)

  _onBackPress = () => {
    const { dispatch, nav } = this.props

    // Close Application
    if (nav.index === 0 && nav.routes[0].index === 0) return false

    // Go Back
    dispatch(NavigationActions.back())
    return true
  }

  _onCloseModal = () => this.props.setFullscreen(false)

  render = () => {
    const { dispatch, fullscreen, hasNetworkActivity, nav, notification } = this.props

    return (
      <View style={[ theme.style.viewBody, { position: 'relative' } ]}>
        <StatusBar
          {...theme.props.statusBar}
          hidden={!!fullscreen || (notification.message && notification.statusBar)}
          networkActivityIndicatorVisible={hasNetworkActivity}
        />

        <Modal
          animationType='fade'
          transparent={false}
          visible={!!fullscreen}
          onRequestClose={this._onCloseModal}
          presentationStyle='fullScreen'
          supportedOrientations={[ 'portrait' ]}
        >
          <View style={style.fullscrenView}>{fullscreen || null}</View>
        </Modal>

        <Notification notification={notification} />

        <RootNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  fullscreen        : state.app.fullscreen,
  hasNetworkActivity: state.app.hasNetworkActivity,
  nav               : state.nav,
  notification      : state.app.notification,
})

const mapDispatchToProps = dispatch => {
  const appBinded = bindActionCreators(appAction, dispatch)
  return {
    dispatch,
    setCurrentLocale  : appSelector.setCurrentLocaleAction(appBinded),
    setFullscreen     : appSelector.setFullscreenAction(appBinded),
    removeNotification: appSelector.removeNotificationAction(appBinded),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Root)
