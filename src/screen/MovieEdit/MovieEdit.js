/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { View } from 'react-native'

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
import { appAction, appSelector, movieAction, movieSelector, mediaCoverAction, mediaCoverSelector } from 'src/reducer'

import * as MovieDetailSelector from 'src/screen/MovieDetail/MovieDetail.selector'
//import style from './MovieEdit.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator } from 'src/component'

//////////
// Init //
//////////
class MovieEdit extends React.Component {
  static displayName = 'MovieEdit'

  static navigationOptions = ({ navigation: { state: { params } } }) => ({
    title: params && params.title ? params.title : localization.t('movieEdit'),
  })

  constructor(props) {
    super(props)
    this._onPressResyncInfo = debounce(config.debounceTime, true, this._onPressResyncInfo)
    this._onPressDownloadPoster = debounce(config.debounceTime, true, this._onPressDownloadPoster)
    this._onPressDownloadBanner = debounce(config.debounceTime, true, this._onPressDownloadBanner)
  }

  state = {
    animateResync          : false,
    animateRedownloadPoster: false,
    animateRedownloadBanner: false,
  }

  componentWillMount = () => {
    const { movie, navigation: { setParams } } = this.props

    this.movie = movie

    setParams({
      title            : movie.title,
      _onPressEditMovie: this._onPressEditMovie,
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      if(__DEV__) console.log('Render', 'MovieEdit', 'currentRoute')
      return true
    }
    return false
  }

  _onPressResyncInfo = async () => {
    if (this.state.animateResync) return
    this.setState({ animateResync: true })

    const { server, getMovie, storeMovie, setNotification, navigation } = this.props

    const { payload: fetched } = await getMovie({ server, movieId: this.movie.id })
    const movie = fetched.find(e => e.id === this.movie.id)
    if (!movie) {
      setNotification({ type: 'error', message: 'Failed to fetch movie info' })
      this.setState({ animateResync: false })
      return
    }

    const { payload: stored } = await storeMovie({ server, movie })
    if (!stored.find(e => e.id === movie.id)) {
      setNotification({ type: 'error', message: 'Failed to sync movie info' })
      this.setState({ animateResync: false })
      return
    }

    setNotification({ type: 'success', message: 'Synced movie info' })
    navigation.setParams({ movie })
    this.movie = movie

    this.setState({ animateResync: false })
  }

  _onPressDownloadPoster = async () => {
    if (this.state.animateRedownloadPoster) return
    this.setState({ animateRedownloadPoster: true })

    const { server, getOneMediaCover, purgeMediaCover, setNotification } = this.props

    await purgeMediaCover({ movie: this.movie, mediaType: 'poster' })
    const downloaded = await getOneMediaCover({ server, movie: this.movie, mediaType: 'poster' })

    if (downloaded) {
      setNotification({ type: 'success', message: 'Poster downloaded' })
    } else {
      setNotification({ type: 'error', message: 'Failed to downloaded poster' })
    }

    this.setState({ animateRedownloadPoster: false })
  }

  _onPressDownloadBanner = async () => {
    if (this.state.animateRedownloadBanner) return
    this.setState({ animateRedownloadBanner: true })

    const { server, getOneMediaCover, purgeMediaCover, setNotification } = this.props

    await purgeMediaCover({ movie: this.movie, mediaType: 'banner' })
    const downloaded = await getOneMediaCover({ server, movie: this.movie, mediaType: 'banner' })

    if (downloaded) {
      setNotification({ type: 'success', message: 'Banner downloaded' })
    } else {
      setNotification({ type: 'error', message: 'Failed to downloaded banner' })
    }

    this.setState({ animateRedownloadBanner: false })
  }

  render = () => (
    <View style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}>
      <ListItem
        onPress={this.state.animateResync ? null : this._onPressResyncInfo}
        center={localization.t('resyncMovieInfo')}
        right={{ name: 'sync' }}
        animateRight={this.state.animateResync}
      />
      <ListItemSeparator />

      <ListItem
        onPress={this.state.animateRedownloadPoster ? null : this._onPressDownloadPoster}
        center={localization.t('redownloadPoster')}
        right={{ name: 'download' }}
        animateRight={this.state.animateRedownloadPoster ? 'bounce' : false}
      />
      <ListItemSeparator />

      <ListItem
        onPress={this.state.animateRedownloadBanner ? null : this._onPressDownloadBanner}
        center={localization.t('redownloadBanner')}
        right={{ name: 'download' }}
        animateRight={this.state.animateRedownloadBanner ? 'bounce' : false}
      />
    </View>
  )
}

const mapStateToProps = state => ({
  movie               : MovieDetailSelector.getMovie(state),
  server              : state.server.active,
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  const appBinded = bindActionCreators(appAction, dispatch)
  const movieBinded = bindActionCreators(movieAction, dispatch)
  const mediaCoverBinded = bindActionCreators(mediaCoverAction, dispatch)
  return {
    dispatch,
    setNotification : appSelector.setNotificationAction(appBinded),
    getMovie        : movieSelector.getAction(movieBinded),
    storeMovie      : movieSelector.storeAction(movieBinded),
    getOneMediaCover: mediaCoverSelector.getOneAction(mediaCoverBinded),
    purgeMediaCover : mediaCoverSelector.purgeAction(mediaCoverBinded),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MovieEdit),

  navigationOptions: {},
}
