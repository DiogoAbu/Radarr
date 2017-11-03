/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import PropTypes from 'prop-types'
import { Image, Text, View } from 'react-native'

/////////////////
// Third-party //
/////////////////
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////
import style from './MovieCard.style'
import Tag from './Tag'

import { base64Image, config, theme } from 'src/constant'
import { localization } from 'src/localization'
import TouchableItem from './TouchableItem'

//////////
// Init //
//////////
export default class MovieCard extends React.Component {
  static propTypes = {
    movie             : PropTypes.object.isRequired,
    style             : PropTypes.any,
    onPress           : PropTypes.func,
    onPressPoster     : PropTypes.func,
    hasImageDownloaded: PropTypes.bool,
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.hasImageDownloaded !== this.props.hasImageDownloaded) {
      return true
    }
    if (!isEqual(nextProps.movie, this.props.movie)) {
      return true
    }
    return false
  }

  _onPress = () => {
    if (this.props.onPress) this.props.onPress(this.props.movie)
  }

  _onPressPoster = () => {
    if (this.props.onPressPoster) this.props.onPressPoster(this.props.movie)
  }

  render = () => {
    const { movie } = this.props

    const status = [ 'tba', 'announced', 'incinemas', 'released', 'predb' ].includes(movie.status.toLowerCase()) ? movie.status : 'unknown'

    return (
      <TouchableItem
        noRipple={true}
        style={[ style.container, this.props.style ]}
        onPress={this._onPress}
        disabled={!this.props.onPress}
      >
        <TouchableItem
          noRipple={true}
          onPress={this._onPressPoster}
          disabled={!this.props.onPressPoster}
        >
          <Image
            resizeMode='cover'
            source={{ uri: `${config.mediaCover.root}/poster${movie.imdbId}.${config.mediaCover.ext}` }}
            defaultSource={{ uri: base64Image.poster }}
            style={style.image}
          />
        </TouchableItem>

        <View style={style.containerRight}>
          <View style={style.containerInfo}>
            <Text
              {...theme.props.selectable}
              numberOfLines={2}
              ellipsizeMode='tail'
              style={style.title}
            >
              {movie.title}
            </Text>
            <Text
              {...theme.props.selectable}
              numberOfLines={2}
              ellipsizeMode='tail'
              style={style.year}
            >
              {movie.year} {movie.genres.length !== 0 ? `- ${movie.genres.map(genre => localization.t(genre)).join(', ')}` : null}
            </Text>
          </View>

          <View style={style.containerTags}>
            <View style={style.containerTagsInner}>
              <Tag
                style={style.tag}
                brand='primary'
              >
                {localization.t(status)}
              </Tag>

              {movie.downloaded ? (
                <Tag
                  style={style.tag}
                  brand={movie.hasFile ? 'success' : 'warning'}
                >
                  {localization.t('downloaded')}
                </Tag>
              ) : movie.isAvailable ? (
                <Tag
                  style={style.tag}
                  brand='success'
                >
                  {localization.t('available')}
                </Tag>
              ) : (
                <Tag
                  style={style.tag}
                  brand='default'
                >
                  {localization.t('unavailable')}
                </Tag>
              )}

              <Tag
                style={style.tag}
                brand='info'
              >
                {movie.monitored ? localization.t('monitored') : localization.t('unmonitored')}
              </Tag>
            </View>
          </View>
        </View>
      </TouchableItem>
    )
  }
}
