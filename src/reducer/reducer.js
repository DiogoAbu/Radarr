/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import { combineReducers } from 'redux'

/////////////////
// Third-party //
/////////////////

////////////
// Custom //
////////////
import { app } from './app'
import { nav } from './nav'
import { server } from './server'

import { movie } from './movie'
import { profile } from './profile'
import { queue } from './queue'
import { history } from './history'
import { wantedMissing } from './wantedMissing'
import { calendar } from './calendar'
import { diskspace } from './diskspace'
import { systemStatus } from './systemStatus'

import { MoreHistoryReducer } from 'src/screen/MoreHistory'
import { MovieIndexReducer } from 'src/screen/MovieIndex'
import { QueueIndexReducer } from 'src/screen/QueueIndex'
import { WantedIndexReducer } from 'src/screen/WantedIndex'

//////////
// Init //
//////////
export default combineReducers({
  app,
  nav,
  server,

  movie,
  profile,
  queue,
  history,
  wantedMissing,
  calendar,
  diskspace,
  systemStatus,

  MoreHistory: MoreHistoryReducer,
  MovieIndex : MovieIndexReducer,
  QueueIndex : QueueIndexReducer,
  WantedIndex: WantedIndexReducer,
})
