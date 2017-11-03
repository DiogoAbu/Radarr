/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////

/////////////////
// Third-party //
/////////////////
import { NavigationActions } from 'react-navigation'

////////////
// Custom //
////////////
import TYPE from './nav.type'

import { RootNavigator } from 'src/navigator'

//////////
// Init //
//////////
const initialState = RootNavigator.router.getStateForAction(NavigationActions.init())

/**
 * Navigate to route
 * @param  {string} navigateOptions Name of the route
 * @param  {object} state           State to use for navigator
 * @return {object}                 New state
 */
function navigate(navigateOptions, state) {
  return RootNavigator.router.getStateForAction(NavigationActions.navigate(navigateOptions), state)
}

/**
 * Go to route without the possibility of going back
 * @param  {object} navigateOptions Name of the route
 * @param  {object} state           State to use for navigator
 * @return {object}                 New state
 */
function resetRoute(navigateOptions, state) {
  return RootNavigator.router.getStateForAction(
    NavigationActions.reset({
      index  : 0,
      key    : null,
      actions: [ NavigationActions.navigate(navigateOptions) ],
    }),
    state
  )
}

/**
 * Handle navigator actions
 * @param  {object} state  State
 * @param  {object} action Action to run
 * @return {object}        New state
 */
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TYPE.NAVIGATE: {
      return navigate(action.payload, state)
    }
    case TYPE.RESET: {
      return resetRoute(action.payload, state)
    }
  }

  return RootNavigator.router.getStateForAction(action, state) || state
}

export default reducer
