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

export const readAction = createSelector(
  actionGetter,
  ({ get }) => get
)

export const storeAction = createSelector(
  actionGetter,
  ({ store }) => store
)

export const removeAction = createSelector(
  actionGetter,
  ({ remove }) => remove
)

export const purgeAction = createSelector(
  actionGetter,
  ({ purge }) => purge
)

export const setActiveAction = createSelector(
  actionGetter,
  ({ setActive }) => setActive
)
