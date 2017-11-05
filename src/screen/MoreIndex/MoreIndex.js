/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { FlatList, Text } from 'react-native'

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
import { appSelector, mediaCoverAction, mediaCoverSelector } from 'src/reducer'

import style from './MoreIndex.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator, TouchableItem } from 'src/component'

//////////
// Init //
//////////
class MoreIndex extends React.Component {
  static displayName = 'MoreIndex'

  static navigationOptions = ({ navigation: { state: { params } } }) => ({
    title: params && params.title ? params.title : '',
  })

  constructor(props) {
    super(props)
    this._onPressServer = debounce(config.debounceTime, true, this._onPressServer)
    this._onPressItem = debounce(config.debounceTime, true, this._onPressItem)

    this._list = [
      { key: 10, text: 'profile', routeName: 'MoreProfile' },
      { key: 20, text: 'calendar', routeName: 'MoreCalendar' },
      { key: 30, text: 'history', routeName: 'MoreHistory' },
      { key: 40, text: 'diskspace', routeName: 'MoreDiskspace' },
      { key: 50, text: 'systemStatus', routeName: 'MoreSystemStatus' },
      { key: 60, text: 'notifications', routeName: 'MoreNotification' },
    ]
  }

  componentWillMount = () => {
    const { server, navigation: { setParams } } = this.props

    setParams({ title: server.name })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MoreIndex', 'currentRoute')
      return true
    }
    return false
  }

  _onPressServer = () => this.props.dispatch({ type: 'RESET', payload: { routeName: 'Server' } })

  _onPressItem = routeName => this.props.navigation.navigate(routeName)

  _purgeAll = () => {
    for (const movie of this.props.imdbIdArray) {
      this.props.purgeMediaCover({ movie, mediaType: 'poster' })
      this.props.purgeMediaCover({ movie, mediaType: 'banner' })
    }
  }

  _getItemLayoutSort = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _renderItem = ({ item }) => (<ListItem
    onPress={() => this._onPressItem(item.routeName)}
    center={localization.t(item.text)}
  />)

  render = () => {
    const { server } = this.props

    return (
      <FlatList
        style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}
        data={this._list}
        renderItem={this._renderItem}
        getItemLayout={this._getItemLayout}
        ItemSeparatorComponent={ListItemSeparator}
        removeClippedSubviews={true}
        indicatorStyle={theme.scrollBarStyle}
        ListHeaderComponent={
          <ListItem
            style={{ marginBottom: theme.grid }}
            onPressRight={this._onPressServer}
            left={{ name: server.icon, color: server.iconColor, size: theme.fontSizeXl }}
            center={[
              <Text
                key='serverName'
                style={style.title}
              >
                {server.name}
              </Text>,
              <Text
                key='serverURL'
                {...theme.props.oneLine}
                style={style.url}
              >
                {server.ssl === true ? <Icon
                  style={style.icon}
                  name='lock'
                /> : null}
                {server.ssl === true ? ' ' : null}
                {server.host}:{server.port}
                {server.urlBase}
              </Text>,
            ]}
            right={{ name: 'logout-variant' }}
          />
        }
        ListFooterComponent={
          <TouchableItem
            style={[ theme.style.buttonError, { marginVertical: theme.grid } ]}
            onPress={this._purgeAll}
          >
            <Text style={theme.style.textButton}>Purge all media covers</Text>
          </TouchableItem>
        }
      />
    )
  }
}

const mapStateToProps = state => ({
  imdbIdArray         : state.movie.list.map(e => ({ imdbId: e.imdbId })),
  server              : state.server.active,
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    purgeMediaCover: mediaCoverSelector.purgeAction(bindActionCreators(mediaCoverAction, dispatch)),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MoreIndex),

  navigationOptions: {},
}
