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
import { createSelector } from 'reselect'

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

export const readAction = createSelector(
  actionGetter,
  ({ read }) => read
)

export const getAction = createSelector(
  actionGetter,
  ({ get }) => get
)

export const storeAction = createSelector(
  actionGetter,
  ({ store }) => store
)

export const purgeAction = createSelector(
  actionGetter,
  ({ purge }) => purge
)

export const removeAction = createSelector(
  actionGetter,
  ({ remove }) => remove
)
