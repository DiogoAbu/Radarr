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
import moment from 'moment'
import naturalSort from 'node-natural-sort'

////////////
// Custom //
////////////

//////////
// Init //
//////////
const list = [
  { key: 10, text: 'titleAZ', sort: { by: 'title', order: 'ASC' } },
  { key: 20, text: 'titleZA', sort: { by: 'title', order: 'DESC' } },

  { key: 30, text: 'latestAdded', sort: { by: 'added', order: 'DESC' } },
  { key: 40, text: 'earliestAdded', sort: { by: 'added', order: 'ASC' } },

  { key: 50, text: 'latestDownloaded', sort: { by: 'fileAdded', order: 'DESC' } },
  { key: 60, text: 'earliestDownloaded', sort: { by: 'fileAdded', order: 'ASC' } },
]

const added = sortDirection => (a, b) => {
  if (!a.added) return sortDirection === 'ASC' ? -1 : 1
  if (!b.added) return sortDirection === 'ASC' ? 1 : -1

  const A = moment.utc(a.added)
  const B = moment.utc(b.added)

  if (sortDirection === 'ASC') {
    return A.diff(B)
  }
  return B.diff(A)
}

const fileAdded = sortDirection => (a, b) => {
  if (!a.movieFile || !a.movieFile.dateAdded) return sortDirection === 'ASC' ? -1 : 1
  if (!b.movieFile || !b.movieFile.dateAdded) return sortDirection === 'ASC' ? 1 : -1

  const A = moment.utc(a.movieFile.dateAdded)
  const B = moment.utc(b.movieFile.dateAdded)

  if (sortDirection === 'ASC') {
    return A.diff(B)
  }
  return B.diff(A)
}

const physicalRelease = sortDirection => (a, b) => {
  if (!a.physicalRelease) return sortDirection === 'ASC' ? -1 : 1
  if (!b.physicalRelease) return sortDirection === 'ASC' ? 1 : -1

  const A = moment.utc(a.physicalRelease)
  const B = moment.utc(b.physicalRelease)

  if (sortDirection === 'ASC') {
    return A.diff(B)
  }
  return B.diff(A)
}

const title = sortDirection => (a, b) => {
  const options = {
    caseSensitive: false,
    order        : sortDirection === 'ASC' ? 'ASC' : 'DESC',
  }

  return naturalSort(options)(a.sortTitle, b.sortTitle)
}

export default { list, added, fileAdded, physicalRelease, title }
