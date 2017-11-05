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
import { createSelectorCreator, defaultMemoize } from 'reselect'
import isEqual from 'lodash.isequal'

////////////
// Custom //
////////////

//////////
// Init //
//////////
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

const profileListGetter = state => state.profile.list

export const getProfileArray = createDeepEqualSelector(profileListGetter, profileList =>
  profileList.map(profile => ({
    id      : profile.id,
    name    : profile.name,
    language: profile.language,
    cutoff  : profile.cutoff.name,
    restNum : profile.items.reduce((total, e) => (e.allowed === true ? total + 1 : total), 0),
  }))
)
