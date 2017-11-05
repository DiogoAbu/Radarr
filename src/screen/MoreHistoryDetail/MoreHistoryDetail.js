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
//import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
//import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'
import { debounce } from 'throttle-debounce'
import isEqual from 'lodash.isequal'

import moment from 'moment'
require('moment-duration-format')

////////////
// Custom //
////////////
import { appSelector } from 'src/reducer'

import style from './MoreHistoryDetail.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator } from 'src/component'

//////////
// Init //
//////////
class MoreHistoryDetail extends React.Component {
  static displayName = 'MoreHistoryDetail'

  static navigationOptions = ({ navigation: { state: { params: { item } } } }) => ({
    title: item.movie.title || localization.t('details'),
  })

  constructor(props) {
    super(props)
    this._onPressShowInfo = debounce(config.debounceTime, true, this._onPressShowInfo)
    this._onPressGoTo = debounce(config.debounceTime, true, this._onPressGoTo)
  }

  state = {}

  componentWillMount = () => {}

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MoreHistoryDetail', 'currentRoute')
      return true
    }
    return false
  }

  _getItemLayout = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _getIcon = status => {
    switch (status.toLowerCase()) {
      case 'grabbed': {
        return { size: theme.fontSizeXl, name: 'cloud-download' }
      }
      case 'downloadFailed'.toLowerCase(): {
        return { size: theme.fontSizeXl, name: 'cloud-download', color: theme.brandErrorDark }
      }
      case 'downloadFolderImported'.toLowerCase(): {
        return { size: theme.fontSizeXl, name: 'download' }
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
      center={localization.t(item.text)}
      styleCenter={style.titleContainer}
      right={
        <Text
          {...theme.props.threeLine}
          style={[ theme.style.text, style.value ]}
        >
          {item.value}
        </Text>
      }
      styleRight={style.valueContainer}
    />
  )

  render = () => {
    const { navigation: { state: { params: { item } } } } = this.props
    let data = []

    if (item.eventType.toLowerCase() === 'grabbed') {
      data = [
        { key: 100, text: 'type', value: localization.t(item.eventType) },
        { key: 150, text: 'name', value: item.sourceTitle },
        { key: 200, text: 'size', value: localization.toHumanSize(item.data.size) },
        { key: 250, text: 'quality', value: item.quality.quality.name },
        { key: 275, text: 'qualityCutoffNotMet', value: localization.t(item.qualityCutoffNotMet.toString()) },
        { key: 300, text: 'indexer', value: item.data.indexer },
        { key: 350, text: 'releaseGroup', value: item.data.releaseGroup },
        { key: 400, text: 'downloadClient', value: item.data.downloadClient },
        { key: 450, text: 'ageWhenGrabbed', value: moment.duration(item.data.ageHours, 'hours').format(`m [${localization.t('min')}]`) },
        { key: 500, text: 'published', value: moment.utc(item.publishedDate).format('L LTS') },
      ]
    } else if (item.eventType.toLowerCase() === 'downloadFolderImported'.toLowerCase()) {
      data = [
        { key: 100, text: 'type', value: localization.t(item.eventType) },
        { key: 150, text: 'name', value: item.sourceTitle },
        { key: 250, text: 'quality', value: item.quality.quality.name },
        { key: 275, text: 'qualityCutoffNotMet', value: localization.t(item.qualityCutoffNotMet.toString()) },
        { key: 400, text: 'downloadClient', value: item.data.downloadClient },
        { key: 500, text: 'published', value: moment.utc(item.publishedDate).format('L LTS') },
      ]
    } else if (item.eventType.toLowerCase() === 'downloadFailed'.toLowerCase()) {
      data = [
        { key: 100, text: 'type', value: localization.t(item.eventType) },
        { key: 150, text: 'name', value: item.sourceTitle },
        { key: 250, text: 'quality', value: item.quality.quality.name },
        { key: 275, text: 'qualityCutoffNotMet', value: localization.t(item.qualityCutoffNotMet.toString()) },
        { key: 400, text: 'downloadClient', value: item.data.downloadClient },
        { key: 500, text: 'message', value: localization.t(item.data.message) },
      ]
    } else if (item.eventType.toLowerCase() === 'movieFileDeleted'.toLowerCase()) {
      data = [
        { key: 100, text: 'type', value: localization.t(item.eventType) },
        { key: 150, text: 'name', value: item.sourceTitle },
        { key: 250, text: 'quality', value: item.quality.quality.name },
        { key: 275, text: 'qualityCutoffNotMet', value: localization.t(item.qualityCutoffNotMet.toString()) },
        { key: 500, text: 'reason', value: localization.t(item.data.reason) },
      ]
    }

    return (
      <FlatList
        style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}
        data={data}
        renderItem={this._renderItem}
        getItemLayout={this._getItemLayout}
        indicatorStyle={theme.scrollBarStyle}
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
  return {
    dispatch,
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MoreHistoryDetail),

  navigationOptions: {},
}
