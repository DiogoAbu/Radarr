/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { FlatList, LayoutAnimation, SectionList, Text, UIManager, View } from 'react-native'

// Enable LayoutAnimation if required
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)

/////////////////
// Third-party //
/////////////////
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import isEqual from 'lodash.isequal'
import { debounce } from 'throttle-debounce'

import moment from 'moment'

////////////
// Custom //
////////////
import { appSelector, calendarAction, calendarSelector } from 'src/reducer'

import * as selfAction from './MoreCalendar.action'
import * as selfSelector from './MoreCalendar.selector'
import style from './MoreCalendar.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'
import { ListItem, ListItemSeparator, Modal, TouchableItem } from 'src/component'

//////////
// Init //
//////////
class MoreCalendar extends React.Component {
  static displayName = 'MoreCalendar'

  static navigationOptions = ({ navigation: { state: { params } } }) => ({
    title      : localization.t('calendar'),
    headerRight: (
      <View style={theme.style.viewHeaderButtonContainer}>
        <TouchableItem
          style={theme.style.viewHeaderButton}
          onPress={params ? params._onPressYearShow : undefined}
        >
          <Text style={theme.style.text}>{params ? params.currentYear : '----'}</Text>
        </TouchableItem>
      </View>
    ),
  })

  constructor(props) {
    super(props)
    this._onPressItemMonth = debounce(config.debounceTime, true, this._onPressItemMonth)
    this._onPressYearShow = debounce(config.debounceTime, true, this._onPressYearShow)
    this._onPressYearHide = debounce(config.debounceTime, true, this._onPressYearHide)
    this._onPressItemYear = debounce(config.debounceTime, true, this._onPressItemYear)

    this._monthArray = moment.monthsShort()
  }

  state = {
    fetching     : false,
    isShowingYear: false,
  }

  componentWillMount = () => {
    const { navigation, currentYear } = this.props
    navigation.setParams({ currentYear, _onPressYearShow: this._onPressYearShow })
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'MoreCalendar', 'currentRoute')

      const yearArray = [ this.props.currentYear ]
      for (let i = 1; i < config.calendarYearPeriod + 1; i++) {
        yearArray.unshift(this.props.currentYear - i)
      }
      for (let i = 1; i < config.calendarYearPeriod + 1; i++) {
        yearArray.push(this.props.currentYear + i)
      }
      this._yearArray = yearArray

      return true
    }
    return false
  }

  _onPressYearShow = () => this.setState({ isShowingYear: true })

  _onPressYearHide = () => this.setState({ isShowingYear: false })

  _onPressItemYear = year => {
    const { action, getCalendar, server, currentMonth, navigation } = this.props
    if (this.state.fetching) return
    try {
      this.setState({ fetching: true, isShowingYear: false })
    } catch (e) {
      //
    }
    setTimeout(() => {
      navigation.setParams({ currentYear: year })
      LayoutAnimation.spring()
      action.setCurrentYear(year)
      getCalendar({ server, params: { month: currentMonth + 1, year }, onDone: this._onDone })
    }, 0)
  }

  _onPressItemMonth = month => {
    const { action, getCalendar, server, currentYear } = this.props
    if (this.state.fetching) return
    try {
      this.setState({ fetching: true, isShowingYear: false })
    } catch (e) {
      //
    }
    setTimeout(() => {
      LayoutAnimation.spring()
      action.setCurrentMonth(month)
      getCalendar({ server, params: { month: month + 1, year: currentYear }, onDone: this._onDone })
    }, 0)
  }

  _onDone = () => {
    try {
      LayoutAnimation.spring()
      this.setState({ fetching: false, isShowingYear: false })
    } catch (e) {
      //
    }
  }

  _onLayoutScrollToMonth = () => {
    if (this.props.currentMonth >= this._monthArray.length / 2) {
      setTimeout(() => this._monthList.scrollToEnd({ animated: false }), 0)
    }
  }

  _getStatusLevel = movie => {
    const hasFile = movie.hasFile
    const monitored = movie.monitored
    const status = movie.status.toLowerCase()
    const downloading = this.props.queueIDArray.includes(movie.id)

    let statusLevel = theme.calendarAnnounced

    if (hasFile) {
      statusLevel = theme.calendarDownloaded
    } else if (downloading) {
      statusLevel = theme.calendarDownloading
    } else if (!monitored) {
      statusLevel = theme.calendarUnmonitored
    } else if (status === 'incinemas') {
      statusLevel = theme.calendarInCinemas
    } else if (status === 'released') {
      statusLevel = theme.calendarMissing
    } else if (status === 'announced') {
      statusLevel = theme.calendarAnnounced
    }

    return statusLevel
  }

  _keyExtractor = item => item.id
  _getItemLayout = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _renderItemYear = ({ item }) => (<ListItem
    return={item}
    onPress={this._onPressItemYear}
    center={item.toString()}
  />)

  _renderItemMonth = ({ item, index }) => (
    <ListItem
      return={index}
      onPress={this._onPressItemMonth}
      center={item.toUpperCase()}
      styleCenter={{ flex: 1, alignItems: 'center', alignSelf: 'stretch' }}
      styleTextCenter={{ textAlign: 'center' }}
      right={null}
      style={[ style.itemMonth, index === this.props.currentMonth && style.itemMonthActive ]}
    />
  )

  _renderItemMovie = ({ item: movie }) => (
    <ListItem
      left={{
        name : movie.radarrAppPhysicalRelease ? 'file-video' : movie.radarrAppInCinemas ? 'ticket-confirmation' : 'checkbox-blank-circle',
        color: this._getStatusLevel(movie),
      }}
      center={movie.title}
      right={null}
    />
  )

  render = () => (
    <View
      style={[ theme.style.viewBody, this.props.hasNotificationStyle, style.outerContainer ]}
      onLayout={this._onLayoutScrollToMonth}
    >
      <Modal
        visible={this.state.isShowingYear}
        onRequestClose={this._onPressYearHide}
        style={style.modal}
      >
        <FlatList
          data={this._yearArray}
          renderItem={this._renderItemYear}
          keyExtractor={item => `year-${item}`}
          getItemLayout={this._getItemLayout}
          ItemSeparatorComponent={ListItemSeparator}
          indicatorStyle={theme.scrollBarStyle}
        />
      </Modal>

      <FlatList
        ref={ref => (this._monthList = ref)}
        style={style.listMonth}
        data={this._monthArray}
        extraData={this.props.currentMonth}
        renderItem={this._renderItemMonth}
        keyExtractor={item => `month-${item}`}
        getItemLayout={this._getItemLayout}
        ItemSeparatorComponent={ListItemSeparator}
        indicatorStyle={theme.scrollBarStyle}
        initialNumToRender={12}
      />

      {this.state.fetching ? (
        <View style={theme.style.viewVerticalCenter}>
          <Text style={theme.style.textLoading}>{localization.t('loading')}</Text>
        </View>
      ) : (
        <SectionList
          style={style.listCalendar}
          sections={this.props.calendarArray}
          renderItem={this._renderItemMovie}
          renderSectionHeader={({ section }) => <Text style={[ theme.style.text, style.titleList ]}>{section.title}</Text>}
          keyExtractor={this._keyExtractor}
          getItemLayout={this._getItemLayout}
          ItemSeparatorComponent={ListItemSeparator}
          indicatorStyle={theme.scrollBarStyle}
          ListEmptyComponent={
            <View style={theme.style.viewVerticalCenter}>
              <Text style={theme.style.textLoading}>{localization.t('noMoviesForThisMonth')}</Text>
            </View>
          }
        />
      )}
    </View>
  )
}

const mapStateToProps = state => ({
  currentMonth        : selfSelector.getCurrentMonth(state),
  currentYear         : selfSelector.getCurrentYear(state),
  calendarArray       : selfSelector.getCalendarArrayForMonth(state),
  queueIDArray        : selfSelector.getQueueIDArray(state),
  server              : state.server.active,
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  return {
    dispatch,
    action     : bindActionCreators(selfAction, dispatch),
    getCalendar: calendarSelector.getAction(bindActionCreators(calendarAction, dispatch)),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(MoreCalendar),

  navigationOptions: {},
}
