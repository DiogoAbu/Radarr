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
import { capitalize } from 'src/lib'

//////////
// Init //
//////////
const profileGetter = (state, id) => state.profile.list.find(e => e.id === id)

export const getProfile = createSelector(profileGetter, profile => [
  {
    title: 'general',
    data : [
      { key: 100, text: 'name', value: profile.name },
      { key: 200, text: 'language', value: capitalize(profile.language) },
      { key: 300, text: 'tags', value: profile.preferredTags },
      { key: 400, text: 'cutoff', value: profile.cutoff.name },
    ],
  },
  {
    title: 'qualities',
    data : profile.items.map(e => ({ key: e.quality.id, text: e.quality.name, value: e.allowed })).reverse(),
  },
])
