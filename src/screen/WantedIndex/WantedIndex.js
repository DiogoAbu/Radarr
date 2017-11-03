/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { FlatList, InteractionManager, LayoutAnimation, RefreshControl, Text, View } from 'react-native'

/////////////////
// Third-party //
/////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
//import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { debounce } from 'throttle-debounce'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import { appAction, appSelector, wantedMissingAction, wantedMissingSelector } from 'src/reducer'

import * as movieIndexAction from '../MovieIndex/MovieIndex.action'

import * as selfAction from './WantedIndex.action'
import * as selfSelector from './WantedIndex.selector'
import style from './WantedIndex.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator, TouchableItem } from 'src/component'

//////////
// Init //
//////////
class WantedIndex extends React.Component {
  static displayName = 'WantedIndex'

  static navigationOptions = ({ navigation: { state: { params } } }) => ({
    title     : 'WantedIndex',
    headerLeft:
      params && params.isSelecting ? (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={params ? params._onPressCancelSelecting : undefined}
          >
            <Text style={theme.style.text}>{localization.t('cancel')}</Text>
          </TouchableItem>
        </View>
      ) : (
        undefined
      ),
    headerRight:
      params && params.isSelecting ? (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={params ? params._onPressSearchAll : undefined}
          >
            <Text style={theme.style.text}>{localization.t('search')}</Text>
          </TouchableItem>
        </View>
      ) : (
        undefined
      ),
  })

  constructor(props) {
    super(props)
    this._onPressSelect = debounce(config.debounceTime, true, this._onPressSelect)
    this._onPressGoTo = debounce(config.debounceTime, true, this._onPressGoTo)
    this._onPressSearch = debounce(config.debounceTime, true, this._onPressSearch)
    this._onPressCancelSelecting = debounce(config.debounceTime, true, this._onPressCancelSelecting)
    this._onPressSearchAll = debounce(config.debounceTime, true, this._onPressSearchAll)
  }

  state = {
    isGettingNextPage: false,
    isRefreshing     : false,
    isSyncing        : false,
    isSelecting      : false,
    selectedArray    : [],
  }

  componentWillMount = () => {
    this.props.navigation.setParams({
      _onPressCancelSelecting: this._onPressCancelSelecting,
      _onPressSearchAll      : this._onPressSearchAll,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      if (__DEV__) console.log('Render', 'WantedIndex', 'currentRoute')
      return true
    }
    return false
  }

  _initWantedSync = async () => {
    const { server, setNetworkActivity, setNotification, syncWantedMissing } = this.props

    if (this.state.isSyncing) return
    this.setState({ isSyncing: true })
    setNetworkActivity(true)

    await syncWantedMissing({
      server,
      onDoneStore: () =>
        setNotification({
          type     : 'success',
          message  : `${localization.t('wantedMissing')}: ${localization.t('fetchedNewDataFromServer')}`,
          serverKey: server.key,
        }),
    })

    this.setState({ isSyncing: false, isRefreshing: false })
    setNetworkActivity(false)
  }

  ////////////
  // HEADER //
  ////////////
  _onPressCancelSelecting = (skipAnim, cb) => {
    if (skipAnim !== false) LayoutAnimation.spring()
    this.setState({ isSelecting: false, selectedArray: [] }, cb)
    this.props.navigation.setParams({ isSelecting: false })
  }

  _onPressSearchAll = () => {
    //
  }

  //////////
  // ITEM //
  //////////
  _onPressSelect = movieId => {
    if (!this.state.isSelecting) {
      LayoutAnimation.spring()
      this.setState({ isSelecting: true, selectedArray: [ movieId ] })
      this.props.navigation.setParams({ isSelecting: true })
      return
    }

    const selectedArray = [ ...this.state.selectedArray ]
    const index = selectedArray.findIndex(e => e === movieId)

    if (index === -1) {
      selectedArray.push(movieId)
    } else {
      selectedArray.splice(index, 1)
    }

    LayoutAnimation.spring()
    this.setState({ selectedArray })
  }

  _onPressGoTo = movieId => {
    const { setMovieActive, dispatch } = this.props
    setMovieActive(movieId)
    requestAnimationFrame(() => {
      dispatch({ type: 'NAVIGATE', payload: { routeName: 'MovieDetail' } })
    })
  }

  _onPressSearch = movieId => {
    //
  }

  _onRefresh = () => {
    if (this.state.isSyncing) return

    this.setState({ isRefreshing: true })
    this._initWantedSync()
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
      case 'announced': {
        return { size: theme.fontSizeXl, name: 'bullhorn' }
      }
      case 'incinemas': {
        return { size: theme.fontSizeXl, name: 'ticket-confirmation' }
      }
      case 'released': {
        return { size: theme.fontSizeXl, name: 'file-video' }
      }
      default: {
        return { size: theme.fontSizeXl, name: 'movie' }
      }
    }
  }

  _renderItem = ({ item: movie }) => (
    <ListItem
      key={movie.key}
      return={movie.id}
      onPressLeft={this._onPressSelect}
      onPressCenter={this.state.isSelecting ? this._onPressSelect : this._onPressGoTo}
      onPressRight={this.state.isSelecting ? this._onPressSelect : this._onPressSearch}
      left={
        this.state.selectedArray.includes(movie.id)
          ? { name: 'check-circle', color: theme.brandSuccess, size: theme.fontSizeXl }
          : this.state.isSelecting
            ? { name: 'checkbox-blank-circle-outline', color: theme.brandWarningDarker, size: theme.fontSizeXl }
            : this._getIcon(movie.status)
      }
      center={movie.title}
      right={this.state.isSelecting ? this._getIcon(movie.status) : { name: 'magnify' }}
    />
  )

  render = () => {
    const { wantedArray, isLastPage } = this.props
    const { isGettingNextPage, isRefreshing, isSyncing } = this.state

    return (
      <View style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}>
        <FlatList
          scrollEnabled={isGettingNextPage === false}
          style={style.wantedList}
          data={wantedArray}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          getItemLayout={this._getItemLayout}
          initialNumToRender={config.wantedInitialNumToRender}
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
  wantedArray         : selfSelector.getWantedArrayForPage(state),
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
    syncWantedMissing : wantedMissingSelector.syncAction(bindActionCreators(wantedMissingAction, dispatch)),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(WantedIndex),

  navigationOptions: {},
}
