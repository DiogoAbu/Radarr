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
import style from './MoviePoster.style'

import { base64Image, config, theme } from 'src/constant'
import { localization } from 'src/localization'
import TouchableItem from './TouchableItem'

//////////
// Init //
//////////
export default class MoviePoster extends React.Component {
  static propTypes = {
    movie             : PropTypes.object.isRequired,
    style             : PropTypes.any,
    onPress           : PropTypes.func,
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

  render = () => {
    const { movie } = this.props

    return (
      <TouchableItem
        noRipple={true}
        style={[ style.container, this.props.style ]}
        onPress={this._onPress}
      >
        <Image
          resizeMode='cover'
          source={{ uri: `${config.mediaCover.root}/poster${movie.imdbId}.${config.mediaCover.ext}` }}
          defaultSource={{ uri: base64Image.poster }}
          style={style.image}
        >
          <View style={style.overlay}>
            <Text
              {...theme.props.selectable}
              style={style.title}
            >
              {movie.title}
            </Text>

            <Text
              {...theme.props.selectable}
              numberOfLines={1}
              ellipsizeMode='tail'
              style={style.year}
            >
              {movie.year} {movie.genres.length !== 0 ? `- ${movie.genres.map(genre => localization.t(genre)).join(', ')}` : null}
            </Text>
          </View>
        </Image>
      </TouchableItem>
    )
  }
}
