/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { FlatList, Text, View } from 'react-native'

/////////////////
// Third-party //
/////////////////
//import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import isEqual from 'lodash.isequal'
import ProgressBar from 'react-native-progress/Bar'

////////////
// Custom //
////////////
import { appSelector } from 'src/reducer'

import * as selfSelector from './MoreDiskspace.selector'
import style from './MoreDiskspace.style'

import { theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator } from 'src/component'

//////////
// Init //
//////////
const ITEM_HEIGHT = theme.grid * 3

class MoreDiskspace extends React.Component {
  static displayName = 'MoreDiskspace'

  static navigationOptions = () => ({
    title: localization.t('diskspace'),
  })

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      if(__DEV__) console.log('Render', 'MoreDiskspace', 'currentRoute')
      return true
    }
    return false
  }

  _keyExtractor = item => item.path
  _getItemLayoutSort = (data, index) => ({ length: ITEM_HEIGHT, offset: (ITEM_HEIGHT + theme.listItemSeparatorHeight) * index, index })

  _renderItem = ({ item }) => (
    <ListItem
      height={ITEM_HEIGHT}
      center={
        <View style={style.centerContainer}>
          <Text
            {...theme.props.oneLine}
            style={[ theme.style.text, style.path ]}
          >
            {item.path}
          </Text>

          <ProgressBar
            progress={parseFloat(((item.totalSpace - item.freeSpace) / item.totalSpace).toFixed(1))}
            width={null}
            color={item.color}
            borderColor={item.color}
          />

          <View style={style.sizeContainer}>
            <Text
              {...theme.props.oneLine}
              style={[ theme.style.text, style.size ]}
            >
              {localization.toHumanSize(item.totalSpace - item.freeSpace)}
            </Text>
            <Text
              {...theme.props.oneLine}
              style={[ theme.style.text, style.size, style.sizeRight ]}
            >
              {localization.toHumanSize(item.totalSpace)}
            </Text>
          </View>
        </View>
      }
      right={null}
    />
  )

  render = () => (
    <FlatList
      style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}
      data={this.props.diskspaceArray}
      renderItem={this._renderItem}
      keyExtractor={this._keyExtractor}
      getItemLayout={this._getItemLayout}
      ItemSeparatorComponent={ListItemSeparator}
      indicatorStyle={theme.scrollBarStyle}
      ListEmptyComponent={
        <View style={theme.style.viewVerticalCenter}>
          <Text style={theme.style.textLoading}>{localization.t('noDiskspace')}</Text>
        </View>
      }
    />
  )
}

const mapStateToProps = state => ({
  server              : state.server.active,
  diskspaceArray      : selfSelector.getDiskspaceArray(state),
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MoreDiskspace),

  navigationOptions: {},
}
