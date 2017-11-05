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
import { debounce } from 'throttle-debounce'

////////////
// Custom //
////////////
import { appSelector } from 'src/reducer'

import * as selfSelector from './MoreProfile.selector'
import style from './MoreProfile.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { capitalize } from 'src/lib'
import { ListItem, ListItemSeparator } from 'src/component'

//////////
// Init //
//////////
class MoreProfile extends React.Component {
  static displayName = 'MoreProfile'

  static navigationOptions = () => ({
    title: localization.t('profile'),
  })

  constructor(props) {
    super(props)
    this._onPressItem = debounce(config.debounceTime, true, this._onPressItem)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MoreProfile', 'currentRoute')
      return true
    }
    return false
  }

  _onPressItem = id => this.props.navigation.navigate('MoreProfileDetail', { id })

  _keyExtractor = item => item.id
  _getItemLayoutSort = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _renderItem = ({ item }) => (
    <ListItem
      return={item.id}
      onPress={this._onPressItem}
      center={
        <View>
          <Text
            {...theme.props.oneLine}
            style={[ theme.style.text, style.name ]}
          >
            {item.name} <Text style={style.language}>- {capitalize(item.language)}</Text>
          </Text>
          <Text
            {...theme.props.oneLine}
            style={[ theme.style.text, style.quality ]}
          >
            {item.cutoff} <Text style={style.rest}>+{item.restNum}</Text>
          </Text>
        </View>
      }
    />
  )

  render = () => (
    <FlatList
      style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}
      data={this.props.profileArray}
      renderItem={this._renderItem}
      keyExtractor={this._keyExtractor}
      getItemLayout={this._getItemLayout}
      ItemSeparatorComponent={ListItemSeparator}
      indicatorStyle={theme.scrollBarStyle}
      ListEmptyComponent={
        <View style={theme.style.viewVerticalCenter}>
          <Text style={theme.style.textLoading}>{localization.t('noProfile')}</Text>
        </View>
      }
    />
  )
}

const mapStateToProps = state => ({
  profileArray        : selfSelector.getProfileArray(state),
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MoreProfile),

  navigationOptions: {},
}
