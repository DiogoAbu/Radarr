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
import moment from 'moment'

////////////
// Custom //
////////////

//////////
// Init //
//////////
const createDeepEqualSelector = createSelectorCreator(defaultMemoize, isEqual)

const calendarListGetter = state => state.calendar.list
export const getCurrentMonth = state => state.MoreCalendar.currentMonth
export const getCurrentYear = state => state.MoreCalendar.currentYear

const getQueueList = state => state.queue.list

const getCalendarArray = createDeepEqualSelector(calendarListGetter, calendarList =>
  calendarList.map(movie => ({
    downloaded         : movie.downloaded,
    genres             : movie.genres,
    hasFile            : movie.hasFile,
    id                 : movie.id,
    inCinemas          : movie.inCinemas,
    physicalRelease    : movie.physicalRelease,
    isAvailable        : movie.isAvailable,
    minimumAvailability: movie.minimumAvailability,
    monitored          : movie.monitored,
    status             : movie.status,
    title              : movie.title,
  }))
)

export const getQueueIDArray = createDeepEqualSelector(getQueueList, queueList =>
  // Reduce movie data
  queueList.reduce((a, queue) => a.concat(queue.movie.id), [])
)

export const getCalendarArrayForMonth = createDeepEqualSelector([ getCalendarArray, getCurrentMonth, getCurrentYear ], (calendarArray, currentMonth, currentYear) => {
  const sections = []

  calendarArray.map(movie => {
    let timeAdded = -1

    if (movie.physicalRelease) {
      const releaseTime = moment.utc(movie.physicalRelease)

      // If releasing this month and year
      if (currentMonth === releaseTime.month() && currentYear === releaseTime.year()) {
        const time = releaseTime.date()
        const index = sections.findIndex(e => e.title === time)

        // Found an section for this time
        if (index !== -1) {
          timeAdded = sections[index].title
          sections[index].data.push({ ...movie, radarrAppPhysicalRelease: true })
        } else {
          timeAdded = time
          // Add a section for this time
          sections.push({
            title: time,
            data : [ { ...movie, radarrAppPhysicalRelease: true } ],
          })
        }
      }
    }

    if (movie.inCinemas) {
      const inCinemasTime = moment.utc(movie.inCinemas)

      // If in cinemas this month and year
      if (currentMonth === inCinemasTime.month() && currentYear === inCinemasTime.year() && timeAdded !== inCinemasTime.date()) {
        const time = inCinemasTime.date()
        const index = sections.findIndex(e => e.title === time)

        // Found an section for this time
        if (index !== -1) {
          sections[index].data.push({ ...movie, radarrAppInCinemas: true })
        } else {
          // Add a section for this time
          sections.push({
            title: time,
            data : [ { ...movie, radarrAppInCinemas: true } ],
          })
        }
      }
    }
  })

  return sections.sort((a, b) => a.title - b.title)
})
