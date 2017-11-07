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

////////////
// Custom //
////////////
import { appSelector } from 'src/reducer'

import * as selfSelector from './MoreSystemStatus.selector'
import style from './MoreSystemStatus.style'

import { theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator } from 'src/component'

//////////
// Init //
//////////
class MoreSystemStatus extends React.Component {
  static displayName = 'MoreSystemStatus'

  static navigationOptions = () => ({
    title: localization.t('systemStatus'),
  })

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MoreSystemStatus', 'currentRoute')
      return true
    }
    return false
  }

  _getItemLayout = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _renderItem = ({ item: { key, text, value, raw } }) => (
    <ListItem
      key={key}
      center={localization.t(text)}
      styleCenter={style.titleContainer}
      right={raw ? value : localization.t(value)}
      styleRight={style.valueContainer}
    />
  )

  render = () => (
    <FlatList
      style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}
      data={this.props.systemStatusArray}
      renderItem={this._renderItem}
      getItemLayout={this._getItemLayout}
      ItemSeparatorComponent={ListItemSeparator}
      indicatorStyle={theme.scrollBarStyle}
      ListEmptyComponent={
        <View style={theme.style.viewVerticalCenter}>
          <Text style={theme.style.textLoading}>{localization.t('theEnd')}</Text>
        </View>
      }
    />
  )
}

const mapStateToProps = state => ({
  systemStatusArray   : selfSelector.getSystemStatusArray(state),
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MoreSystemStatus),

  navigationOptions: {},
}
