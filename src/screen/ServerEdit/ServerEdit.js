/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { FlatList } from 'react-native'

/////////////////
// Third-party //
/////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import { appAction, appSelector } from 'src/reducer'

import style from './ServerEdit.style'

import { theme } from 'src/constant'
import { localization } from 'src/localization'

import { ListItem, ListItemSeparator } from 'src/component'

//////////
// Init //
//////////
class ServerEdit extends React.Component {
  static displayName = 'ServerEdit'

  static navigationOptions = props => {
    const { navigation: { state: { params: { server } } } } = props

    return {
      title: localization.t('serverEditName', { name: server.name }),
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'ServerEdit', 'currentRoute')
      return true
    }
    return false
  }

  _onPressItem = routeName => {
    const { navigation: { setParams, navigate, state: { params: { server } } } } = this.props
    navigate(routeName, { server, isEditing: server => setParams({ server }) })
  }

  _getItemLayout = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _renderServerItem = ({ item }) => (
    <ListItem
      key={item.key}
      onPress={item.onPress}
      center={localization.t(item.key)}
      styleCenter={style.titleContainer}
      right={item.iconColor ? { name: item.value, color: item.iconColor } : item.value}
      styleRight={style.valueContainer}
    />
  )

  render = () => {
    const { navigation: { state: { params: { server } } } } = this.props

    const data = [
      {
        key    : 'name',
        value  : server.name,
        onPress: () => this._onPressItem('NameScreen'),
      },
      {
        key      : 'icon',
        value    : server.icon,
        iconColor: server.iconColor,
        onPress  : () => this._onPressItem('IconScreen'),
      },
      {
        key    : 'host',
        value  : server.host,
        onPress: () => this._onPressItem('HostScreen'),
      },
      {
        key    : 'port',
        value  : server.port.toString(),
        onPress: () => this._onPressItem('PortScreen'),
      },
      {
        key    : 'urlBase',
        value  : server.urlBase || '',
        onPress: () => this._onPressItem('UrlBaseScreen'),
      },
      {
        key    : 'ssl',
        value  : localization.t(server.ssl.toString()).toString(),
        onPress: () => this._onPressItem('SslScreen'),
      },
      {
        key    : 'apiKey',
        value  : server.apiKey,
        onPress: () => this._onPressItem('ApiKeyScreen'),
      },
    ]

    return (
      <FlatList
        style={theme.style.viewBody}
        data={data}
        renderItem={this._renderServerItem}
        getItemLayout={this._getItemLayout}
        ItemSeparatorComponent={ListItemSeparator}
      />
    )
  }
}

const mapStateToProps = state => ({
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  const appBinded = bindActionCreators(appAction, dispatch)
  return {
    dispatch,
    setNotification: appSelector.setNotificationAction(appBinded),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(ServerEdit),

  navigationOptions: {},
}
