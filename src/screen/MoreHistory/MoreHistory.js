/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { FlatList, InteractionManager, RefreshControl, Text, View } from 'react-native'

/////////////////
// Third-party //
/////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
//import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { debounce } from 'throttle-debounce'
import isEqual from 'lodash.isequal'

import moment from 'moment'

////////////
// Custom //
////////////
import { appAction, appSelector, historyAction, historySelector } from 'src/reducer'

import * as movieIndexAction from '../MovieIndex/MovieIndex.action'

import * as selfAction from './MoreHistory.action'
import * as selfSelector from './MoreHistory.selector'
import style from './MoreHistory.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator } from 'src/component'

//////////
// Init //
//////////
class MoreHistory extends React.Component {
  static displayName = 'MoreHistory'

  static navigationOptions = () => ({
    title: localization.t('history'),
  })

  constructor(props) {
    super(props)
    this._onPressShowInfo = debounce(config.debounceTime, true, this._onPressShowInfo)
    this._onPressGoTo = debounce(config.debounceTime, true, this._onPressGoTo)
  }

  state = {
    isGettingNextPage: false,
    isRefreshing     : false,
    isSyncing        : false,
  }

  componentWillMount = () => {}

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MoreHistory', 'currentRoute')
      return true
    }
    return false
  }

  _initHistorySync = async () => {
    const { server, setNetworkActivity, setNotification, syncHistory } = this.props

    if (this.state.isSyncing) return
    this.setState({ isSyncing: true })
    setNetworkActivity(true)

    await syncHistory({
      server,
      onDoneStore: () =>
        setNotification({
          type     : 'success',
          message  : `${localization.t('history')}: ${localization.t('fetchedNewDataFromServer')}`,
          serverKey: server.key,
        }),
    })

    this.setState({ isSyncing: false, isRefreshing: false })
    setNetworkActivity(false)
  }

  //////////
  // ITEM //
  //////////
  _onPressShowInfo = item => this.props.navigation.navigate('MoreHistoryDetail', { item })

  _onPressGoTo = movieId => {
    const { setMovieActive, dispatch } = this.props
    setMovieActive(movieId)
    requestAnimationFrame(() => {
      dispatch({ type: 'NAVIGATE', payload: { routeName: 'MovieDetail' } })
    })
  }

  _onRefresh = () => {
    if (this.state.isSyncing) return

    this.setState({ isRefreshing: true })
    this._initHistorySync()
  }

  _onEndReached = () => {
    if (this.state.isSyncing) return

    this.setState({ isGettingNextPage: true })

    InteractionManager.runAfterInteractions(() => {
      this.props.action.setCurrentPage('next')
      this.setState({ isGettingNextPage: false })
    })
  }

  _keyExtractor = item => item.id
  _getItemLayout = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _getIcon = status => {
    switch (status.toLowerCase()) {
      case 'grabbed': {
        return { size: theme.fontSizeXl, name: 'cloud-download' }
      }
      case 'downloadFolderImported'.toLowerCase(): {
        return { size: theme.fontSizeXl, name: 'download' }
      }
      case 'downloadFailed'.toLowerCase(): {
        return { size: theme.fontSizeXl, name: 'cloud-download', color: theme.brandErrorDark }
      }
      case 'movieFileDeleted'.toLowerCase(): {
        return { size: theme.fontSizeXl, name: 'download', color: theme.brandErrorDark }
      }
      default: {
        return { size: theme.fontSizeXl, name: 'movie' }
      }
    }
  }

  _renderItem = ({ item }) => (
    <ListItem
      return={item}
      returnRight={item.movie.id}
      onPressLeft={this._onPressShowInfo}
      onPressCenter={this._onPressShowInfo}
      onPressRight={this._onPressGoTo}
      left={this._getIcon(item.eventType)}
      center={
        <View>
          <Text
            {...theme.props.oneLine}
            style={[ theme.style.text ]}
          >
            {item.movie.title}
          </Text>
          <Text
            {...theme.props.oneLine}
            style={[ theme.style.text, style.below ]}
          >
            {item.quality.quality.name} - {moment.utc(item.date).fromNow()}
          </Text>
        </View>
      }
      right={{ name: 'open-in-new' }}
    />
  )

  render = () => {
    const { historyArray, isLastPage } = this.props
    const { isGettingNextPage, isRefreshing, isSyncing } = this.state

    return (
      <FlatList
        scrollEnabled={isGettingNextPage === false}
        style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}
        data={historyArray}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        getItemLayout={this._getItemLayout}
        initialNumToRender={config.historyInitialNumToRender}
        removeClippedSubviews={true}
        indicatorStyle={theme.scrollBarStyle}
        refreshControl={<RefreshControl
          refreshing={isRefreshing}
          onRefresh={this._onRefresh}
        />}
        onEndReached={isSyncing ? null : this._onEndReached}
        onEndReachedThreshold={0.67}
        ItemSeparatorComponent={ListItemSeparator}
        ListFooterComponent={<Text style={style.footerComponent}>{isLastPage ? localization.t('theEnd') : localization.t('loadingMore')}</Text>}
      />
    )
  }
}

const mapStateToProps = state => ({
  historyArray        : selfSelector.getHistoryArrayForPage(state),
  isLastPage          : selfSelector.getIsLastPage(state),
  server              : state.server.active,
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  const appBinded = bindActionCreators(appAction, dispatch)
  return {
    dispatch,
    action        : bindActionCreators(selfAction, dispatch),
    setMovieActive: bindActionCreators(movieIndexAction, dispatch).setMovieActive,

    setNotification   : appSelector.setNotificationAction(appBinded),
    setNetworkActivity: appSelector.setNetworkActivityAction(appBinded),
    syncHistory       : historySelector.syncAction(bindActionCreators(historyAction, dispatch)),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MoreHistory),

  navigationOptions: {},
}
