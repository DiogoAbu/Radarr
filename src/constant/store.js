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
import { applyMiddleware, createStore } from 'redux'
//import { createLogger } from 'redux-logger'
import asyncThunk from 'redux-async-thunk'

////////////
// Custom //
////////////
import { reducer } from 'src/reducer'

//////////
// Init //
//////////
//const logger = createLogger({ collapsed: true })

// The order of middlewares matters
const middleware = applyMiddleware(asyncThunk/*, logger*/)

// Reducer, initial state and middleware
const store = createStore(reducer, undefined, middleware)

export default store
