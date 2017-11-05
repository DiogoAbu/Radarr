/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import {
  ActivityIndicator,
  Alert,
  FlatList,
  InteractionManager /*, LayoutAnimation*/,
  Modal,
  RefreshControl,
  Text,
  TextInput,
  UIManager,
  View,
} from 'react-native'

// Enable LayoutAnimation if required
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

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
import {
  appAction,
  appSelector,
  movieAction,
  movieSelector,
  profileAction,
  profileSelector,
  queueAction,
  queueSelector,
  historyAction,
  historySelector,
  wantedMissingAction,
  wantedMissingSelector,
  calendarAction,
  calendarSelector,
  diskspaceAction,
  diskspaceSelector,
  systemStatusAction,
  systemStatusSelector,
  mediaCoverAction,
  mediaCoverSelector,
} from 'src/reducer'

import * as selfAction from './MovieIndex.action'
import * as selfSelector from './MovieIndex.selector'
import style from './MovieIndex.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { sortMovie } from 'src/lib'
import { ListItem, ListItemSeparator, MovieCard, MoviePoster, TouchableItem } from 'src/component'

//////////
// Init //
//////////
class MovieIndex extends React.Component {
  static displayName = 'MovieIndex'

  static navigationOptions = props => {
    const { navigation: { state: { params } } } = props

    return {
      title      : localization.t('movies'),
      headerTitle: (
        <TextInput
          {...theme.props.input}
          style={[ theme.style.input, style.headerSearch ]}
          keyboardType={'default'}
          returnKeyType={'search'}
          placeholder={localization.t('searchMovie')}
          onChangeText={params && params._onChangeSearch}
          blurOnSubmit={true}
          onFocus={params && params._onFocusSearch}
          selectTextOnFocus={true}
        />
      ),
      headerLeft: (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={params ? params._onPressSortShow : undefined}
          >
            <Icon
              style={theme.style.textHeaderIcon}
              name='sort'
            />
          </TouchableItem>
        </View>
      ),
      headerRight: (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={params ? params._onPressAdd : undefined}
          >
            <Icon
              style={theme.style.textHeaderIcon}
              name='plus-circle'
            />
          </TouchableItem>
        </View>
      ),
    }
  }

  constructor(props) {
    super(props)
    this._onPressAdd = debounce(config.debounceTime, true, this._onPressAdd)
    this._onPressSortShow = debounce(config.debounceTime, true, this._onPressSortShow)
    this._onPressSortCancel = debounce(config.debounceTime, true, this._onPressSortCancel)
    this._onPressSortItem = debounce(config.debounceTime, true, this._onPressSortItem)
    this._onPressItemMovie = debounce(config.debounceTime, true, this._onPressItemMovie)
    this._onEndReached = debounce(config.debounceTime, true, this._onEndReached)
    this._onChangeSearch = debounce(config.debounceTime / 2, false, this._onChangeSearch)

    // Poster height + the size of the title (41)
    this._offsetToMovieList = theme.moviePoster.height + 41
  }

  state = {
    isLoading         : true,
    isGettingNextPage : false,
    isRefreshing      : false,
    isSorting         : false,
    isSelectingSort   : false,
    isSyncing         : false,
    hasImageDownloaded: false,
  }

  componentDidMount = () => {
    const { activeId, navigation } = this.props

    if(activeId){
      navigation.navigate('MovieDetail')
      return
    }

    navigation.setParams({
      _onPressAdd     : this._onPressAdd,
      _onPressSortShow: this._onPressSortShow,
      _onChangeSearch : this._onChangeSearch,
      _onFocusSearch  : this._onFocusSearch,
    })

    this._initRadarrSync()
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MovieIndex', 'currentRoute')
      return true
    }
    return false
  }

  _initRadarrSync = async () => {
    try {
      const { state: { isSyncing }, props: { server, setNetworkActivity } } = this

      if (isSyncing) return
      this.setState({ isSyncing: true })
      setNetworkActivity(true)

      const movieArray = await this.props.syncMovie({
        server,
        onDoneRead : () => this.setState({ isLoading: false }),
        onDoneStore: this._onDoneMovie('fetchedNewDataFromServer'),
      })
      await this.props.syncProfile({
        server,
        onDoneStore: this._notify('profile', 'fetchedNewDataFromServer'),
      })
      await this.props.syncQueue({
        server,
        onDoneStore: this._notify('queue', 'fetchedNewDataFromServer'),
      })
      await this.props.syncHistory({
        server,
        onDoneStore: this._notify('history', 'fetchedNewDataFromServer'),
      })
      await this.props.syncWantedMissing({
        server,
        onDoneStore: this._notify('wantedMissing', 'fetchedNewDataFromServer'),
      })
      await this.props.syncCalendar({
        server,
        onDoneStore: this._notify('calendar', 'fetchedNewDataFromServer'),
      })
      await this.props.syncDiskspace({
        server,
        onDoneStore: this._notify('diskspace', 'fetchedNewDataFromServer'),
      })
      await this.props.syncSystemStatus({
        server,
        onDoneStore: this._notify('systemStatus', 'fetchedNewDataFromServer'),
      })
      const totalToDownload = await this.props.checkMediaCover({
        server,
        movieArray,
      })
      if (totalToDownload > config.limitToAlertMediaCoverDownload) {
        Alert.alert(
          localization.t('mediaCover'),
          localization.t('mediaCoverDownloadAlert', {
            n     : totalToDownload,
            banner: localization.toHumanSize(1024 * 512),
            poster: localization.toHumanSize(1024 * 1024),
          }),
          [
            { text: localization.t('false'), onPress: () => this._onDoneMediaCover() },
            { text: localization.t('true'), onPress: () => this._onDoDownloadMediaCover(movieArray) },
          ]
        )
      } else {
        this._onDoDownloadMediaCover(movieArray)
      }
    } catch (err) {
      this.props.setNotification({ type: 'error', message: localization.t(err.message), serverKey: this.props.server.key })
    }
  }

  _onDoDownloadMediaCover = async movieArray => {
    await this.props.syncMediaCover({
      server    : this.props.server,
      movieArray,
      onProgress: this._onProgressMediaCover,
      onDone    : this._onDoneMediaCover,
    })
  }

  _onDoneMovie = type => () => {
    try {
      this.setState({ isLoading: false })
    } catch (e) {
      //
    }
    this._notify('movie', type)
  }

  _onProgressMediaCover = title => {
    this.props.setNotification({
      type     : 'success',
      message  : `${localization.t('mediaCover')}: ${localization.t('downloadedForTitle', { title })}`,
      serverKey: this.props.server.key,
    })
  }

  _onDoneMediaCover = () => {
    try {
      this.setState({ isSyncing: false, isRefreshing: false, hasImageDownloaded: true })
    } catch (e) {
      //
    }
    this.props.setNetworkActivity(false)
    this.props.setNotification({ type: 'success', message: localization.t('syncDone'), serverKey: this.props.server.key })
  }

  _notify = (name, type) => () =>
    this.props.setNotification({ type: 'success', message: `${localization.t(name)}: ${localization.t(type)}`, serverKey: this.props.server.key })

  _onFocusSearch = () =>
    this._movieFlatList.scrollToOffset({ offset: this.props.movieArraySearched.length !== 0 ? 0 : this._offsetToMovieList, animated: true })

  _onChangeSearch = query => {
    this.props.action.setMovieQuery(query)
    this._movieFlatList.scrollToOffset({ offset: query ? 0 : this._offsetToMovieList, animated: false })
  }

  _onPressAdd = () => this.props.navigation.navigate('MovieAdd')

  _onPressSortShow = () => this.setState({ isSelectingSort: true })

  _onPressSortCancel = () => this.setState({ isSorting: false, isSelectingSort: false })

  _onPressSortItem = sort => {
    if (this.state.isSorting) return

    requestAnimationFrame(() => {
      // Show sorting spinner at modal
      this.setState({ isSorting: true }, () => {
        setTimeout(() => {
          // Set sort options state
          this.props.action.setMovieSort(sort)

          // Hide sort modal
          this.setState({ isSorting: false, isSelectingSort: false }, () => {
            setTimeout(() => this._movieFlatList.scrollToOffset({ offset: this._offsetToMovieList, animated: true }), 0)
          })
        }, 0)
      })
    })
  }

  _onPressItemMovie = movie => {
    const { action, navigation } = this.props
    action.setMovieActive(movie.id)
    navigation.navigate('MovieDetail')
  }

  _onRefresh = () => {
    if (this.state.isSyncing) return

    this.setState({ isRefreshing: true })
    this._initRadarrSync()
  }

  _onEndReached = () => {
    if (this.state.isSyncing) return

    this.setState({ isGettingNextPage: true })

    InteractionManager.runAfterInteractions(() => {
      this.props.action.setMovieCurrentPage('next')
      this.setState({ isGettingNextPage: false })
    })
  }

  _keyExtractor = item => item.id
  _getItemLayout = (data, index) => ({ length: theme.movieCard.height, offset: (theme.movieCard.height + theme.grid / 6) * index, index })
  _getItemLayoutHorizontal = (data, index) => ({ length: theme.moviePoster.width, offset: (theme.moviePoster.width + theme.grid / 6) * index, index })
  _getItemLayoutSort = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _renderItemMovie = ({ item: movie }) => (
    <MovieCard
      movie={movie}
      onPress={this._onPressItemMovie}
      style={style.hideOverflow}
      hasImageDownloaded={this.state.hasImageDownloaded}
    />
  )

  _renderItemMovieHorizontal = ({ item: movie }) => (
    <MoviePoster
      movie={movie}
      onPress={this._onPressItemMovie}
      style={[ style.hideOverflow, style.itemSeparatorHorizontal ]}
      hasImageDownloaded={this.state.hasImageDownloaded}
    />
  )

  _renderSortItem = ({ item }) => (<ListItem
    return={item.sort}
    onPress={this._onPressSortItem}
    center={localization.t(item.text)}
  />)

  render = () => {
    const { isLoading, isRefreshing, isGettingNextPage, isSorting, isSelectingSort, isSyncing, hasImageDownloaded } = this.state
    const { movieArray, movieArrayHorizontal, movieArraySearched, isLastPage } = this.props

    if (isLoading) {
      return (
        <View style={theme.style.viewVerticalCenter}>
          <ActivityIndicator {...theme.props.spinner} />
          <Text style={style.gettingMoviesLoad}>{localization.t('gettingMovies')}</Text>
        </View>
      )
    }

    if (movieArray.length === 0) {
      return (
        <View style={theme.style.viewVerticalCenter}>
          <Text style={style.gettingMoviesLoad}>{localization.t('noMoviesFound')}</Text>
        </View>
      )
    }

    const hasSearchResults = movieArraySearched.length !== 0

    return (
      <View style={theme.style.viewBody}>
        <Modal
          animationType='fade'
          transparent={true}
          visible={isSelectingSort || isSorting}
          onRequestClose={this._onPressSortCancel}
        >
          <View style={style.sortModalOuterContainer}>
            {isSorting ? (
              <View style={[ theme.style.viewVerticalCenter, style.sortModalContainer ]}>
                <ActivityIndicator {...theme.props.spinner} />
                <Text style={style.gettingMoviesLoad}>{localization.t('sortingMovies')}</Text>
              </View>
            ) : (
              <View style={[ style.sortModalContainer, style.sortModalContainerSelecting ]}>
                <FlatList
                  data={sortMovie.list}
                  renderItem={this._renderSortItem}
                  getItemLayout={this._getItemLayoutSort}
                  ItemSeparatorComponent={ListItemSeparator}
                  removeClippedSubviews={true}
                  indicatorStyle={theme.scrollBarStyle}
                />
                <TouchableItem
                  style={[ theme.style.buttonInfo, { flex: 0 } ]}
                  onPress={this._onPressSortCancel}
                >
                  <Text style={theme.style.textButton}>{localization.t('cancel')}</Text>
                </TouchableItem>
              </View>
            )}
          </View>
        </Modal>

        <FlatList
          ref={movieFlatList => (this._movieFlatList = movieFlatList)}
          horizontal={false}
          scrollEnabled={isGettingNextPage === false}
          style={[ style.movieList, this.props.hasNotificationStyle ]}
          data={hasSearchResults ? movieArraySearched : movieArray}
          extraData={hasImageDownloaded}
          renderItem={this._renderItemMovie}
          keyExtractor={this._keyExtractor}
          getItemLayout={this._getItemLayout}
          initialNumToRender={config.movieInitialNumToRender}
          removeClippedSubviews={true}
          indicatorStyle={theme.scrollBarStyle}
          refreshControl={hasSearchResults ? null : <RefreshControl
            refreshing={isRefreshing}
            onRefresh={this._onRefresh}
          />}
          onEndReached={hasSearchResults || isSyncing ? null : this._onEndReached}
          onEndReachedThreshold={0.67}
          ItemSeparatorComponent={() => <View style={style.itemSeparator} />}
          ListHeaderComponent={
            hasSearchResults ? (
              <Text style={style.titleList}>{localization.t('movies')}</Text>
            ) : (
              <View>
                <Text style={style.titleList}>{localization.t('latestDownloaded')}</Text>
                <FlatList
                  horizontal={true}
                  style={style.movieListHorizontal}
                  data={movieArrayHorizontal}
                  extraData={hasImageDownloaded}
                  renderItem={this._renderItemMovieHorizontal}
                  keyExtractor={this._keyExtractor}
                  getItemLayout={this._getItemLayoutHorizontal}
                  initialNumToRender={config.movieInitialNumToRender}
                  removeClippedSubviews={true}
                  indicatorStyle={theme.scrollBarStyle}
                  // https://github.com/facebook/react-native/pull/15865
                  //ItemSeparatorComponent={() => <View style={style.itemSeparatorHorizontal} />}
                />
                <Text style={style.titleList}>{localization.t('movies')}</Text>
              </View>
            )
          }
          ListFooterComponent={
            <Text style={style.footerComponent}>
              {hasSearchResults
                ? localization.t('showingUpToNResults', { n: config.movieLocalSearchLimit })
                : isLastPage ? localization.t('theEnd') : localization.t('loadingMore')}
            </Text>
          }
        />
      </View>
    )
  }
}

const mapStateToProps = state => ({
  movieArray          : selfSelector.getMovieArrayForPage(state),
  movieArrayHorizontal: selfSelector.getMovieArrayDownloaded(state),
  movieArraySearched  : selfSelector.getMovieArrayForQuery(state),
  isLastPage          : selfSelector.getIsLastPage(state),
  activeId            : state.MovieIndex.activeId,
  server              : state.server.active,
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  const appBinded = bindActionCreators(appAction, dispatch)
  const mediaCoverBinded = bindActionCreators(mediaCoverAction, dispatch)
  return {
    dispatch,
    action            : bindActionCreators(selfAction, dispatch),
    setNotification   : appSelector.setNotificationAction(appBinded),
    setNetworkActivity: appSelector.setNetworkActivityAction(appBinded),

    syncMovie        : movieSelector.syncAction(bindActionCreators(movieAction, dispatch)),
    syncProfile      : profileSelector.syncAction(bindActionCreators(profileAction, dispatch)),
    syncQueue        : queueSelector.syncAction(bindActionCreators(queueAction, dispatch)),
    syncHistory      : historySelector.syncAction(bindActionCreators(historyAction, dispatch)),
    syncWantedMissing: wantedMissingSelector.syncAction(bindActionCreators(wantedMissingAction, dispatch)),
    syncCalendar     : calendarSelector.syncAction(bindActionCreators(calendarAction, dispatch)),
    syncDiskspace    : diskspaceSelector.syncAction(bindActionCreators(diskspaceAction, dispatch)),
    syncSystemStatus : systemStatusSelector.syncAction(bindActionCreators(systemStatusAction, dispatch)),
    syncMediaCover   : mediaCoverSelector.syncAction(mediaCoverBinded),
    checkMediaCover  : mediaCoverSelector.checkAction(mediaCoverBinded),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MovieIndex),

  navigationOptions: {},
}
