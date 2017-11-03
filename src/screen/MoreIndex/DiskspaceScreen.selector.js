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
import naturalSort from 'node-natural-sort'
import randomFlatColors from 'random-flat-colors'

////////////
// Custom //
////////////

//////////
// Init //
//////////
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

const diskspaceListGetter = state => state.diskspace.list

export const getDiskspaceArray = createDeepEqualSelector(diskspaceListGetter, diskspaceList => {
  return diskspaceList.map(disk => {
    return {
      ...disk,
      color: randomFlatColors([ 'blue', 'green', 'orange', 'purple', 'red', 'yellow' ]),
    }
  }).sort((a, b) => naturalSort()(a.path, b.path))
})
