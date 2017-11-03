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
import { filterActions } from 'redux-ignore'

////////////
// Custom //
////////////
import TYPE from './systemStatus.type'

import { createReducer } from 'src/lib'

//////////
// Init //
//////////
const initialState = {
  version          : '',
  buildTime        : '',
  isDebug          : false,
  isProduction     : true,
  isAdmin          : true,
  isUserInteractive: false,
  startupPath      : '',
  appData          : '',
  osVersion        : '',
  isMonoRuntime    : true,
  isMono           : true,
  isLinux          : true,
  isOsx            : false,
  isWindows        : false,
  branch           : '',
  authentication   : '',
  sqliteVersion    : '',
  urlBase          : '',
  runtimeVersion   : '',
}

const reducer = {
  [TYPE.SET_SYSTEMSTATUS]: (state, { payload }) => ({
    ...payload,
  }),
}

export default filterActions(createReducer(initialState, reducer), Object.values(TYPE))
