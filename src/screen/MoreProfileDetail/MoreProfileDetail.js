/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { SectionList, Switch, Text, View } from 'react-native'

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

import * as selfSelector from './MoreProfileDetail.selector'
import style from './MoreProfileDetail.style'

import { theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator } from 'src/component'

//////////
// Init //
//////////
class MoreProfileDetail extends React.Component {
  static displayName = 'MoreProfileDetail'

  static navigationOptions = () => ({
    title: localization.t('details'),
  })

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MoreProfileDetail', 'currentRoute')
      return true
    }
    return false
  }

  _getItemLayout = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _renderItem = ({ item }) =>
    item.value === true || item.value === false ? (
      <ListItem
        center={item.text}
        styleCenter={style.titleContainer}
        right={<Switch
          {...theme.props.switch}
          value={item.value}
        />}
        styleRight={style.valueContainer}
      />
    ) : (
      <ListItem
        center={localization.t(item.text)}
        styleCenter={style.titleContainer}
        right={item.value}
        styleRight={style.valueContainer}
      />
    )

  render = () => (
    <SectionList
      style={[ theme.style.viewBody, this.props.hasNotificationStyle ]}
      sections={this.props.profile}
      renderItem={this._renderItem}
      renderSectionHeader={({ section }) => <Text style={[ theme.style.text, style.titleList ]}>{localization.t(section.title)}</Text>}
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

const mapStateToProps = (state, props) => ({
  profile             : selfSelector.getProfile(state, props.navigation.state.params.id),
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MoreProfileDetail),

  navigationOptions: {},
}
