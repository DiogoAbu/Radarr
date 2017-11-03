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
import { createSelector, createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////

//////////
// Init //
//////////
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

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

export const getProfile = createDeepEqualSelector(
  (state, id) => state.profile.list.find(e => e.id === id),
  profile => profile !== -1 && profile
)
