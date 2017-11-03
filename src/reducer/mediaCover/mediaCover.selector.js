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
import { createSelector} from 'reselect'

////////////
// Custom //
////////////

//////////
// Init //
//////////
const actionGetter = action => action

export const syncAction = createSelector(
  actionGetter,
  ({ sync }) => sync
)

export const dirAction = createSelector(
  actionGetter,
  ({ dir }) => dir
)

export const checkAction = createSelector(
  actionGetter,
  ({ check }) => check
)

export const getAction = createSelector(
  actionGetter,
  ({ get }) => get
)

export const getOneAction = createSelector(
  actionGetter,
  ({ getOne }) => getOne
)

export const purgeAction = createSelector(
  actionGetter,
  ({ purge }) => purge
)
