/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { FlatList, Image, LayoutAnimation, Text, UIManager, View } from 'react-native'

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

////////////
// Custom //
////////////
import { appSelector, serverAction, serverSelector } from 'src/reducer'

import style from './ServerIndex.style'

import { config, theme } from 'src/constant'
import { localization } from 'src/localization'

import { ListItem, ListItemSeparator, Modal, TouchableItem } from 'src/component'

//////////
// Init //
//////////
class ServerIndex extends React.Component {
  static displayName = 'ServerIndex'

  static navigationOptions = ({ navigation: { state: { params } } }) => ({
    title     : localization.t('servers'),
    headerLeft:
      params && params.isSelecting ? (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={params ? params._onPressCancelSelecting : undefined}
          >
            <Text style={theme.style.text}>{localization.t('cancel')}</Text>
          </TouchableItem>
        </View>
      ) : (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={params ? params._onPressShowAbout : undefined}
          >
            <Icon
              style={theme.style.textHeaderIcon}
              name='information'
            />
          </TouchableItem>
        </View>
      ),
    headerRight:
      params && params.isSelecting ? (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={params ? params._onPressEdit : undefined}
          >
            <Text style={theme.style.text}>{localization.t('edit')}</Text>
          </TouchableItem>
        </View>
      ) : (
        <View style={theme.style.viewHeaderButtonContainer}>
          <TouchableItem
            style={theme.style.viewHeaderButton}
            onPress={params ? params._onPressAdd : undefined}
          >
            <Icon
              style={theme.style.textHeaderIcon}
              name='plus-circle'
            />
          </TouchableItem>
        </View>
      ),
  })

  constructor(props) {
    super(props)
    this._onPressAdd = debounce(config.debounceTime, true, this._onPressAdd)
    this._onPressEdit = debounce(config.debounceTime, true, this._onPressEdit)
    this._onPressCancelSelecting = debounce(config.debounceTime, true, this._onPressCancelSelecting)
    this._onPressItemGo = debounce(config.debounceTime, true, this._onPressItemGo)
    this._onPressItemSelect = debounce(config.debounceTime, true, this._onPressItemSelect)
    this._onPressRemoveAll = debounce(config.debounceTime, true, this._onPressRemoveAll)
    this._onPressRemoveSelected = debounce(config.debounceTime, true, this._onPressRemoveSelected)
    this._onPressShowAbout = debounce(config.debounceTime, true, this._onPressShowAbout)
  }

  state = {
    isSelecting      : false,
    selectedServerKey: [],
    isShowingAbout   : false,
  }

  componentDidMount = async () => {
    const { getServer, navigation } = this.props

    navigation.setParams({
      _onPressAdd            : this._onPressAdd,
      _onPressEdit           : this._onPressEdit,
      _onPressCancelSelecting: this._onPressCancelSelecting,
      _onPressShowAbout      : this._onPressShowAbout,
    })

    LayoutAnimation.linear()
    await getServer()

    setTimeout(() => {
      // HACK jump to server add screen to test UI
      //this._onPressAdd()
      // HACK jump to first server to test UI
      //if(this.props.serverArray.length !== 0) return this._onPressItemGo(this.props.serverArray[0])
    }, 500)
  }

  shouldComponentUpdate(nextProps, nextState) {
    if ((!isEqual(nextProps, this.props) || !isEqual(nextState, this.state)) && nextProps.currentRoute === this.constructor.displayName) {
      console.log('Render', 'ServerIndex', 'currentRoute')
      return true
    }
    return false
  }

  ////////////
  // HEADER //
  ////////////
  _onPressAdd = () => this.props.navigation.navigate('NameScreen', { server: {} })

  _onPressEdit = () => {
    const { state: { isSelecting, selectedServerKey }, props: { serverArray, navigation } } = this

    if (!isSelecting) return

    const server = serverArray.find(e => e.key === selectedServerKey[0])
    if (server) {
      this._onPressCancelSelecting(true, () => {
        navigation.navigate(`ServerEdit`, { server })
      })
    }
  }

  _onPressCancelSelecting = (skipAnim, cb) => {
    if (skipAnim !== false) LayoutAnimation.spring()
    this.setState({ isSelecting: false, selectedServerKey: [] }, cb)
    this.props.navigation.setParams({ isSelecting: false })
  }

  //////////
  // ITEM //
  //////////
  _onPressItemGo = server => {
    const { setServerActive, navigation } = this.props

    setServerActive(server)
    navigation.navigate('Radarr')
  }

  _onPressItemSelect = server => {
    if (!this.state.isSelecting) {
      LayoutAnimation.spring()
      this.setState({ isSelecting: true, selectedServerKey: [ server.key ] })
      this.props.navigation.setParams({ isSelecting: true })
      return
    }

    const selectedServerKey = [ ...this.state.selectedServerKey ]
    const index = selectedServerKey.findIndex(e => e === server.key)

    if (index === -1) {
      selectedServerKey.push(server.key)
    } else {
      selectedServerKey.splice(index, 1)
    }

    LayoutAnimation.spring()
    this.setState({ selectedServerKey })
  }

  ////////////
  // FOOTER //
  ////////////
  _onPressRemoveAll = () => {
    LayoutAnimation.spring()
    this.props.purgeServer()

    this._onPressCancelSelecting()
  }

  _onPressRemoveSelected = () => {
    const { state: { selectedServerKey }, props: { storeServer, serverArray } } = this

    if (selectedServerKey.length === 0) return

    // Return servers not selected
    const serverArrayNew = serverArray.filter(e => !selectedServerKey.includes(e.key))

    LayoutAnimation.spring()
    storeServer(serverArrayNew)
  }

  _onPressShowAbout = () => {
    this.setState({ isShowingAbout: true })
  }

  _onPressHideAbout = () => {
    this.setState({ isShowingAbout: false })
  }

  _getItemLayout = (data, index) => ({ length: theme.listItemHeight, offset: (theme.listItemHeight + theme.listItemSeparatorHeight) * index, index })

  _renderServerItem = ({ item: server }) => (
    <ListItem
      key={server.key}
      return={server}
      onPressLeft={this._onPressItemSelect}
      onPressCenter={this.state.isSelecting ? this._onPressItemSelect : this._onPressItemGo}
      onPressRight={this.state.isSelecting ? this._onPressItemSelect : this._onPressItemGo}
      left={
        this.state.selectedServerKey.includes(server.key)
          ? { name: 'check-circle', color: theme.brandSuccess, size: theme.fontSizeXl }
          : this.state.isSelecting
            ? { name: 'checkbox-blank-circle-outline', color: theme.brandWarningDarker, size: theme.fontSizeXl }
            : { name: server.icon, color: server.iconColor, size: theme.fontSizeXl }
      }
      center={[
        <Text
          key='serverName'
          style={style.title}
        >
          {server.name}
        </Text>,
        <Text
          key='serverURL'
          style={style.url}
        >
          {server.ssl === true ? <Icon
            style={style.icon}
            name='lock'
          /> : null}
          {server.ssl === true ? ' ' : null}
          {server.host}:{server.port}
          {server.urlBase}
        </Text>,
      ]}
      right={this.state.isSelecting ? null : undefined}
    />
  )

  render = () => {
    const { serverArray, hasNotificationStyle } = this.props

    return (
      <View style={[ theme.style.viewBody, hasNotificationStyle ]}>
        <Modal
          visible={this.state.isShowingAbout}
          onRequestClose={this._onPressHideAbout}
        >
          <Image
            style={style.logo}
            source={require('../../../assets/image/128.png')}
            resizeMode={'contain'}
          />
          <Text
            {...theme.props.selectable}
            style={[ theme.style.text, style.aboutTitle ]}
          >
            Unofficial Radarr iOS/Android Client
          </Text>
          <Text
            {...theme.props.selectable}
            style={[ theme.style.text, style.aboutURL ]}
          >
            github.com/LetsMakeApps/Radarr
          </Text>
        </Modal>

        <FlatList
          style={theme.style.viewBody}
          data={serverArray}
          renderItem={this._renderServerItem}
          getItemLayout={this._getItemLayout}
          ItemSeparatorComponent={ListItemSeparator}
          ListEmptyComponent={
            <View style={theme.style.viewVerticalCenter}>
              <Text style={style.noServerTitle}>{localization.t('goAddAServer')}</Text>
            </View>
          }
        />

        {!this.state.isSelecting ? null : (
          <View style={style.footerContainer}>
            <TouchableItem
              style={[ theme.style.button, style.buttonRemoveAll ]}
              onPress={this._onPressRemoveAll}
            >
              <Text style={theme.style.textButton}>{localization.t('removeAll')}</Text>
            </TouchableItem>

            <TouchableItem
              style={[ theme.style.button, style.buttonRemoveSelected ]}
              onPress={this._onPressRemoveSelected}
              disabled={this.state.selectedServerKey.length === 0}
            >
              <Text style={theme.style.textButton}>{localization.t('removeSelected')}</Text>
            </TouchableItem>
          </View>
        )}
      </View>
    )
  }
}

const mapStateToProps = state => ({
  serverArray         : state.server.list,
  hasNotificationStyle: appSelector.getHasNotificationStyle(state),
  currentRoute        : appSelector.getCurrentRoute(state),
})

const mapDispatchToProps = dispatch => {
  const serverBinded = bindActionCreators(serverAction, dispatch)
  return {
    dispatch,
    getServer      : serverSelector.readAction(serverBinded),
    storeServer    : serverSelector.storeAction(serverBinded),
    purgeServer    : serverSelector.purgeAction(serverBinded),
    setServerActive: serverSelector.setActiveAction(serverBinded),
  }
}

export default {
  screen: connect(mapStateToProps, mapDispatchToProps)(ServerIndex),

  navigationOptions: {},
}
