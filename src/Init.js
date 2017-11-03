/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { AppLoading } from 'expo'

/////////////////
// Third-party //
/////////////////
import { Provider } from 'react-redux'
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'

////////////
// Custom //
////////////
import { store } from 'src/constant'
import { Root } from 'src/screen'

import { localization } from 'src/localization'
import { cacheFont } from 'src/lib'

//////////
// Init //
//////////
class Init extends React.Component {
  static displayName = 'Init'

  state = {
    isAppReady: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.isAppReady !== this.state.isAppReady) {
      return true
    }
    return false
  }

  _initAsync = async () => {
    await localization.initAsync()

    await cacheFont([
      Icon.font,
    ])
  }

  _initAsyncDone = () => this.setState({ isAppReady: true })

  render = () =>{
    if(__DEV__) console.log('Render', 'Init')

    if(this.state.isAppReady !== true) {
      return (
        <AppLoading
          startAsync={this._initAsync}
          onFinish={this._initAsyncDone}
        />
      )
    }

    return(
      <Provider store={store}>
        <Root />
      </Provider>
    )
  }
}

export default Init
