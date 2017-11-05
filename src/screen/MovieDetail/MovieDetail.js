/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { ActivityIndicator, Image, LayoutAnimation, ScrollView, Text, UIManager, View } from 'react-native'
import { LinearGradient, WebBrowser } from 'expo'

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

import moment from 'moment'
require('moment-duration-format')

////////////
// Custom //
////////////
import { appAction, appSelector } from 'src/reducer'

import * as selfSelector from './MovieDetail.selector'
import style from './MovieDetail.style'

import { config, theme, base64Image } from 'src/constant'
import { localization } from 'src/localization'
import { MovieCard, TouchableItem } from 'src/component'

//////////
// Init //
//////////
class MovieDetail extends React.Component {
  static displayName = 'MovieDetail'

  static navigationOptions = ({ navigation: { state: { params } } }) => ({
    title      : params && params.title ? params.title : localization.t('movieDetails'),
    headerRight: (
      <View style={theme.style.viewHeaderButtonContainer}>
        <TouchableItem
          style={theme.style.viewHeaderButton}
          onPress={params ? params._onPressEditMovie : undefined}
        >
          <Icon
            style={theme.style.textHeaderIcon}
            name='settings'
          />
        </TouchableItem>
      </View>
    ),
  })

  constructor(props) {
    super(props)
    this._onPressEditMovie = debounce(config.debounceTime, true, this._onPressEditMovie)
    this._onPressShowPoster = debounce(config.debounceTime, true, this._onPressShowPoster)
    this._onPressHidePoster = debounce(config.debounceTime, true, this._onPressHidePoster)
    this._onPressToggleFileDetails = debounce(config.debounceTime, true, this._onPressToggleFileDetails)
    this._onPressOpenVideo = debounce(config.debounceTime, true, this._onPressOpenVideo)
    this._onPressOpenIMDB = debounce(config.debounceTime, true, this._onPressOpenIMDB)
    this._onPressOpenTMDB = debounce(config.debounceTime, true, this._onPressOpenTMDB)
  }

  state = {
    isDetailsVisible: false,
  }

  componentWillMount = () => {
    const { movie, navigation: { setParams } } = this.props

    this.movie = movie

    setParams({
      title            : movie.title,
      _onPressEditMovie: this._onPressEditMovie,
    })

    setTimeout(() => {
      // HACK jump to movie edit
      //this._onPressEditMovie()
    }, 0)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MovieDetail', 'currentRoute')
      return true
    }
    return false
  }

  _onPressEditMovie = () => this.props.navigation.navigate('MovieEdit')

  _onPressShowPoster = () => this.props.setFullscreen(this._renderPoster())

  _onPressHidePoster = () => this.props.setFullscreen(false)

  _onPressToggleFileDetails = () => {
    LayoutAnimation.spring()
    this.setState({ isDetailsVisible: !this.state.isDetailsVisible })
  }

  _onPressOpenVideo = id => WebBrowser.openBrowserAsync(`${config.youtubeVideoLink}${id}`)
  _onPressOpenIMDB = id => WebBrowser.openBrowserAsync(`${config.imdbMovieLink}${id}`)
  _onPressOpenTMDB = id => WebBrowser.openBrowserAsync(`${config.tmdbMovieLink}${id}`)

  _renderPoster = () => (
    <View style={style.modalContainer}>
      <ScrollView
        scrollEnabled={true}
        minimumZoomScale={1}
        maximumZoomScale={3}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.modalPosterContainer}
      >
        <Image
          resizeMode='contain'
          source={{ uri: `${config.mediaCover.root}/poster${this.movie.imdbId}.${config.mediaCover.ext}` }}
          style={style.modalPoster}
        />
      </ScrollView>

      <TouchableItem
        noRipple={true}
        onPress={this._onPressHidePoster}
        style={style.modalButtonContainer}
      >
        <Icon
          style={style.modalButton}
          name='close-box'
        />
      </TouchableItem>
    </View>
  )

  _renderDetailsRow = (data, index = 1) => {
    const key = Object.keys(data)[0]

    return (
      <View
        key={key}
        style={[ style.fileDetailsRow, !(index & 1) ? style.fileDetailsRowStrip : null ]}
      >
        <Text
          {...theme.props.selectable}
          style={style.fileDetailsExpandedTitle}
        >
          {localization.t(key)}
        </Text>
        <Text
          {...theme.props.selectable}
          style={style.fileDetailsExpanded}
        >
          {data[key]}
        </Text>
      </View>
    )
  }

  _renderInfo = () => {
    const { inCinemas, minimumAvailability, monitored, path, profileId, ratings, runtime, studio, year } = this.movie

    let pathFull = path.split('/')
    const pathBaseName = pathFull.pop()
    pathFull = pathFull.join('/') + '/'

    // TODO change from array to obj
    const infoArray = [
      { rating: `${ratings.value} (${ratings.votes} ${localization.t('votes')}) ` },
      { inCinemas: moment.utc(inCinemas).format('L') },
      { year },
      { studio },
      { runTime: moment.duration(runtime, 'minutes').format(`m [${localization.t('min')}]`) },
      { profile: this.props.profile || profileId },
      { monitored: localization.t(`${monitored.toString()}`) },
      { minimumAvailability: localization.t(`${minimumAvailability}`) },
      { path: `${pathFull}\n${pathBaseName}` },
    ]

    return <View style={style.infoContainer}>{infoArray.map((each, index) => this._renderDetailsRow(each, index + 1))}</View>
  }

  _renderFileDetails = () => {
    const { movieFile } = this.movie

    if (!movieFile) {
      return (
        <View style={style.fileContainer}>
          <Text style={style.filePath}>{localization.t('noFileFound')}</Text>

          <View style={style.fileDetailsContainer} />
        </View>
      )
    }

    const audioLanguage = Array.isArray(movieFile.mediaInfo.audioLanguages) ? movieFile.mediaInfo.audioLanguages.join(',') : movieFile.mediaInfo.audioLanguages
    const runTime = !movieFile.mediaInfo.runTime ? '---' : moment.duration(movieFile.mediaInfo.runTime).format(`m [${localization.t('min')}]`)
    const edition = !movieFile.edition ? '---' : movieFile.edition
    const dateAdded = moment.utc(movieFile.dateAdded).format('L')

    const subtitle = Array.isArray(movieFile.mediaInfo.subtitles)
      ? movieFile.mediaInfo.subtitles.join(',')
      : movieFile.mediaInfo.subtitles ? movieFile.mediaInfo.subtitles : '---'

    const detailArray = [
      { quality: movieFile.quality.quality.name },
      { size: localization.toHumanSize(movieFile.size) },
      { runTime },
      { edition },
      { dateAdded },
      { videoCodec: movieFile.mediaInfo.videoCodec },
      { audioFormat: movieFile.mediaInfo.audioFormat },
      { width: movieFile.mediaInfo.width },
      { height: movieFile.mediaInfo.height },
      { fps: movieFile.mediaInfo.videoFps },
      { audioLanguage },
      { subtitle },
    ]

    return (
      <TouchableItem
        noRipple={true}
        onPress={this._onPressToggleFileDetails}
        style={style.fileContainer}
      >
        <Text
          {...theme.props.selectable}
          style={style.filePath}
        >
          {movieFile.relativePath}
        </Text>

        {!movieFile.mediaInfo ? (
          <View style={style.fileDetailsContainer} />
        ) : this.state.isDetailsVisible ? (
          <View style={style.fileDetailsExpandedContainer}>{detailArray.map((each, index) => this._renderDetailsRow(each, index))}</View>
        ) : (
          <View style={style.fileDetailsContainer}>
            <Text
              {...theme.props.selectable}
              style={style.fileInfo}
            >
              {movieFile.quality.quality.name}
            </Text>

            <Text
              {...theme.props.selectable}
              style={style.fileInfo}
            >
              {localization.t('videoFirstLetter')}: {movieFile.mediaInfo.videoCodec}
            </Text>

            <Text
              {...theme.props.selectable}
              style={style.fileInfo}
            >
              {localization.t('audioFirstLetter')}: {movieFile.mediaInfo.audioFormat}
            </Text>
          </View>
        )}
      </TouchableItem>
    )
  }

  render = () => {
    if (!this.props.movie || !this.props.profile) {
      return (
        <View style={theme.style.viewVerticalCenter}>
          <ActivityIndicator {...theme.props.spinner} />
        </View>
      )
    }

    return (
      <ScrollView style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}>
        <TouchableItem
          noRipple={true}
          onPress={() => this._onPressOpenVideo(this.movie.youTubeTrailerId)}
          style={style.bannerImage}
        >
          <Image
            resizeMode='cover'
            source={{ uri: `${config.mediaCover.root}/banner${this.movie.imdbId}.${config.mediaCover.ext}` }}
            style={style.bannerImage}
          >
            <Icon
              style={style.iconPlay}
              name='youtube-play'
            />
          </Image>
        </TouchableItem>

        <LinearGradient
          colors={[ 'rgba(0,0,0,0)', 'rgba(0,0,0,.7)', theme.bodyBg ]}
          locations={[ 0, 0.5, 0.8 ]}
          style={style.bannerGradient}
        />

        <MovieCard
          movie={this.movie}
          onPressPoster={this._onPressShowPoster}
          style={style.movieCard}
        />

        <View style={style.titleContainer}>
          <Text style={style.title}>{localization.t('overview').toUpperCase()}</Text>
          <View style={style.linePrimary} />
        </View>

        <View style={style.overviewContainer}>
          <Text
            {...theme.props.selectable}
            style={style.overview}
          >
            {this.movie.overview}
          </Text>
        </View>

        <View style={style.outLinkContainer}>
          <TouchableItem
            noRipple={true}
            onPress={() => this._onPressOpenIMDB(this.movie.imdbId)}
          >
            <Image
              source={{ uri: base64Image.imdb }}
              resizeMode='contain'
              style={style.outLinkImage}
            />
          </TouchableItem>
          <TouchableItem
            noRipple={true}
            onPress={() => this._onPressOpenTMDB(this.movie.tmdbId)}
          >
            <Image
              source={{ uri: base64Image.tmdb }}
              resizeMode='contain'
              style={style.outLinkImage}
            />
          </TouchableItem>
        </View>

        <View style={style.titleContainer}>
          <Text style={style.title}>{localization.t('info').toUpperCase()}</Text>
          <View style={style.lineSuccess} />
        </View>
        {this._renderInfo()}

        <View style={style.titleContainer}>
          <Text style={style.title}>{localization.t('file').toUpperCase()}</Text>
          <View style={style.lineError} />
        </View>
        {this._renderFileDetails()}
      </ScrollView>
    )
  }
}

const mapStateToProps = state => ({
  movie               : selfSelector.getMovie(state),
  profile             : selfSelector.getProfile(state),
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  const appBinded = bindActionCreators(appAction, dispatch)
  return {
    dispatch,
    setNotification: appSelector.setNotificationAction(appBinded),
    setFullscreen  : appSelector.setFullscreenAction(appBinded),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MovieDetail),

  navigationOptions: {},
}
