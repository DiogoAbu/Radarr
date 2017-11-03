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
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { debounce } from 'throttle-debounce'
import isEqual from 'lodash.isequal'
import ProgressBar from 'react-native-progress/Bar'

////////////
// Custom //
////////////
import { appAction, appSelector, queueAction, queueSelector } from 'src/reducer'

import * as movieIndexAction from '../MovieIndex/MovieIndex.action'

import * as selfAction from './QueueIndex.action'
import * as selfSelector from './QueueIndex.selector'
import style from './QueueIndex.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItemSeparator, TouchableItem } from 'src/component'

//////////
// Init //
//////////
const QUEUE_ITEM_HEIGHT = theme.grid * 3

class QueueIndex extends React.Component {
  static displayName = 'QueueIndex'

  static navigationOptions = () => ({
    title: 'QueueIndex',
  })

  constructor(props) {
    super(props)
    this._onPressShowInfo = debounce(config.debounceTime, true, this._onPressShowInfo)
    this._onPressHideInfo = debounce(config.debounceTime, true, this._onPressHideInfo)
  }

  state = {
    isGettingNextPage: false,
    isRefreshing     : false,
    isSyncing        : false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      if (__DEV__) console.log('Render', 'QueueIndex', 'currentRoute')
      return true
    }
    return false
  }

  _initQueueSync = async () => {
    const { server, setNetworkActivity, setNotification, syncQueue } = this.props

    if (this.state.isSyncing) return
    this.setState({ isSyncing: true })
    setNetworkActivity(true)

    await syncQueue({
      server,
      onDoneStore: () =>
        setNotification({
          type     : 'success',
          message  : `${localization.t('queue')}: ${localization.t('fetchedNewDataFromServer')}`,
          serverKey: server.key,
        }),
    })

    this.setState({ isSyncing: false, isRefreshing: false })
    setNetworkActivity(false)
  }

  _onPressQueueItem = movieId => {
    const { setMovieActive, dispatch } = this.props
    setMovieActive(movieId)
    requestAnimationFrame(() => {
      dispatch({ type: 'NAVIGATE', payload: { routeName: 'MovieDetail' } })
    })
  }

  _onRefresh = () => {
    if (this.state.isSyncing) return

    this.setState({ isRefreshing: true })
    this._initQueueSync()
  }

  _onEndReached = () => {
    if (this.state.isSyncing) return

    this.setState({ isGettingNextPage: true })

    InteractionManager.runAfterInteractions(() => {
      this.props.action.setCurrentPage('next')
      this.setState({ isGettingNextPage: false })
    })
  }

  _keyExtractor = item => item.downloadId
  _getItemLayout = (data, index) => ({ length: QUEUE_ITEM_HEIGHT, offset: (QUEUE_ITEM_HEIGHT + theme.listItemSeparatorHeight) * index, index })

  _getIcon = status => {
    switch (status.toLowerCase()) {
      case 'queued': {
        return { color: theme.fontColor, name: 'cloud' }
      }
      case 'paused': {
        return { color: theme.fontColor, name: 'pause-circle' }
      }
      case 'downloading': {
        return { color: theme.fontColor, name: 'cloud-download' }
      }
      case 'completed': {
        return { color: theme.fontColor, name: 'inbox' }
      }
      case 'failed': {
        return { color: theme.brandError, name: 'cloud-download' }
      }
      case 'warning': {
        return { color: theme.brandWarning, name: 'cloud-download' }
      }
      default: {
        return { color: theme.fontColor, name: 'movie' }
      }
    }
  }

  _renderItem = ({ item }) => (
    <ProgressBar
      animated={false}
      progress={parseFloat(((item.size - item.sizeleft) / item.size).toFixed(1))}
      width={null}
      height={QUEUE_ITEM_HEIGHT}
      color={theme.brandDefault}
      unfilledColor={theme.listItemBg}
      borderRadius={0}
      borderWidth={0}
      style={{ position: 'relative' }}
    >
      <TouchableItem
        style={{
          position      : 'absolute',
          top           : 0,
          left          : 0,
          right         : 0,
          bottom        : 0,
          flex          : 1,
          flexDirection : 'row',
          justifyContent: 'flex-start',
          alignItems    : 'center',
          alignSelf     : 'stretch',
          flexWrap      : 'nowrap',
          height        : QUEUE_ITEM_HEIGHT,
        }}
        onPress={() => this._onPressQueueItem(item.movie.id)}
      >
        <Icon
          style={[ theme.style.text, { fontSize: theme.fontSizeXx, paddingHorizontal: theme.grid / 1.5, backgroundColor: 'transparent' } ]}
          {...this._getIcon(item.status)}
        />
        <View style={{ flex: -1, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
          <Text
            {...theme.props.oneLine}
            style={[ theme.style.text, { fontSize: theme.fontSizeLg, backgroundColor: 'transparent' } ]}
          >
            {item.movie.title}
          </Text>
          <Text
            {...theme.props.oneLine}
            style={[ theme.style.text, { fontSize: theme.fontSize, color: theme.fontColorFade, backgroundColor: 'transparent' } ]}
          >
            {item.quality.quality.name}
          </Text>
        </View>
        <View
          style={{
            flex          : 0,
            flexGrow      : 1,
            flexDirection : 'column',
            justifyContent: 'center',
            alignItems    : 'flex-end',
            paddingRight  : theme.grid / 1.5,
          }}
        >
          <Text
            {...theme.props.oneLine}
            style={[ theme.style.text, { textAlign: 'right', backgroundColor: 'transparent' } ]}
          >
            {localization.toHumanSize(item.size - item.sizeleft)}
          </Text>
          <Text
            {...theme.props.oneLine}
            style={[ theme.style.text, { textAlign: 'right', backgroundColor: 'transparent' } ]}
          >
            {localization.toHumanSize(item.size)}
          </Text>
        </View>
      </TouchableItem>
    </ProgressBar>
  )

  render = () => {
    const { queueArray, isLastPage } = this.props
    const { isGettingNextPage, isRefreshing, isSyncing } = this.state

    return (
      <View style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}>
        <FlatList
          scrollEnabled={isGettingNextPage === false}
          style={style.queueList}
          data={queueArray}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          getItemLayout={this._getItemLayout}
          initialNumToRender={config.queueInitialNumToRender}
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
      </View>
    )
  }
}

const mapStateToProps = state => ({
  queueArray          : selfSelector.getQueueArrayForPage(state),
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
    syncQueue         : queueSelector.syncAction(bindActionCreators(queueAction, dispatch)),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(QueueIndex),

  navigationOptions: {},
}
