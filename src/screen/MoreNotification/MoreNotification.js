/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { FlatList, Text, View } from 'react-native'

/////////////////
// Third-party //
/////////////////
//import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import { appSelector } from 'src/reducer'

import { theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator } from 'src/component'

//////////
// Init //
//////////
class MoreNotification extends React.Component {
  static displayName = 'MoreNotification'

  static navigationOptions = () => ({
    title: localization.t('notifications'),
  })

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MoreNotification', 'currentRoute')
      return true
    }
    return false
  }

  _getIconAndColor = type => {
    switch (type) {
      case 'success':
        return { name: 'check-circle', color: theme.brandSuccessDark }
      case 'info':
        return { name: 'information', color: theme.brandInfoDark }
      case 'warning':
        return { name: 'alert-circle', color: theme.brandWarningDark }
      case 'error':
        return { name: 'bug', color: theme.brandErrorDark }
      default:
        return { name: 'message-text', color: theme.fontColor }
    }
  }

  _getItemLayout = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _renderItem = ({ item }) => (<ListItem
    left={this._getIconAndColor(item.type)}
    center={item.message}
    right={null}
  />)

  render = () => (
    <FlatList
      style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}
      data={this.props.notificationArray}
      renderItem={this._renderItem}
      getItemLayout={this._getItemLayout}
      ItemSeparatorComponent={ListItemSeparator}
      indicatorStyle={theme.scrollBarStyle}
      ListEmptyComponent={
        <View style={theme.style.viewVerticalCenter}>
          <Text style={theme.style.textLoading}>{localization.t('noNotifications')}</Text>
        </View>
      }
    />
  )
}

const mapStateToProps = state => ({
  server              : state.server.active,
  notificationArray   : appSelector.getNotificationArrayForServer(state),
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MoreNotification),

  navigationOptions: {},
}
