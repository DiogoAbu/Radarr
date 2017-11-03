/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import { FileSystem } from 'expo'

/////////////////
// Third-party //
/////////////////
import * as Parallel from 'async-parallel'

////////////
// Custom //
////////////
import TYPEAPP from '../app/app.type'
import { config } from 'src/constant'
import { apiURL, isValidServer } from 'src/lib'

//////////
// Init //
//////////
/**
 * [sync description]
 * @param  {[type]} server           [description]
 * @param  {[type]} movieArray       [description]
 * @param  {[type]} onProgress     [description]
 * @param  {[type]} onDone [description]
 * @return {[type]}                  [description]
 */
export function sync({ server, movieArray, onProgress, onDone }) {
  return async dispatch => {
    try {
      await dir()(dispatch)
      await get({ server, movieArray, onProgress, onDone })(dispatch)
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [dir description]
 * @return {[type]}
 */
export function dir() {
  return async dispatch => {
    try {
      const pathExists = await FileSystem.getInfoAsync(config.mediaCover.root)
      if (!pathExists || !pathExists.exists) {
        await FileSystem.makeDirectoryAsync(config.mediaCover.root, { intermediates: true })
      }
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message } })
    }
  }
}

/**
 * [check description]
 * @param  {[type]} server     [description]
 * @param  {[type]} movieArray [description]
 * @return {[type]}            [description]
 */
export function check({ server, movieArray }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const movieArrayCopy = Array.isArray ? [ ...movieArray ] : [ { ...movieArray } ]
      let totalToDownload = 0

      /* eslint-disable no-await-in-loop */
      for (const movie of movieArrayCopy) {
        const posterPath = `${config.mediaCover.root}/poster${movie.imdbId}.${config.mediaCover.ext}`
        const posterExists = await FileSystem.getInfoAsync(posterPath)
        if (!posterExists || !posterExists.exists) {
          totalToDownload += 1
        }
        const bannerPath = `${config.mediaCover.root}/banner${movie.imdbId}.${config.mediaCover.ext}`
        const bannerExists = await FileSystem.getInfoAsync(bannerPath)
        if (!bannerExists || !bannerExists.exists) {
          totalToDownload += 1
        }
      }
      /* eslint-enable no-await-in-loop */

      return totalToDownload
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [get description]
 * @param  {[type]} server           [description]
 * @param  {[type]} movieArray       [description]
 * @param  {[type]} onProgress     [description]
 * @param  {[type]} onDone [description]
 * @return {[type]}                  [description]
 */
export function get({ server, movieArray, onProgress, onDone }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }

      const taskArray = Array.isArray ? [ ...movieArray ] : [ { ...movieArray } ]

      await Parallel.pool(config.mediaCoverConcurrency, async () => {
        const movie = taskArray.shift()

        await getOne({ server, movie, mediaType: 'poster', onProgress })(dispatch)
        await getOne({ server, movie, mediaType: 'banner', onProgress })(dispatch)

        return taskArray.length > 0
      })

      if (typeof onDone === 'function') {
        onDone()
      }
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [getOne description]
 * @param  {[type]} server       [description]
 * @param  {[type]} movie        [description]
 * @param  {[type]} mediaType    [description]
 * @param  {[type]} onProgress [description]
 * @return {[type]}              [description]
 */
export function getOne({ server, movie, mediaType, onProgress }) {
  return async dispatch => {
    try {
      if (!isValidServer(server)) {
        throw new Error('Server invalid')
      }
      if (![ 'poster', 'banner' ].includes(mediaType)) return false

      // Get path for chosen image
      const imagePath = `${config.mediaCover.root}/${mediaType}${movie.imdbId}.${config.mediaCover.ext}`

      // Local image exists
      const imageExists = await FileSystem.getInfoAsync(imagePath)
      if (imageExists && imageExists.exists) return false

      // No images available to download
      if (!movie.images || !Array.isArray(movie.images)) return false

      // Get remote image url
      const imageURL = movie.images.find(e => e.coverType === mediaType)
      if (!imageURL || !imageURL.url) return false

      // Clean url - image.jpg?arg=value => image-250.jpg
      const imageURLClean = imageURL.url.replace(/\?.*$/, '').replace(`${mediaType}.`, `${mediaType}-250.`)
      if (!imageURLClean) return false

      // Build url with apiKey
      const url = apiURL(server, imageURLClean, { apiKey: server.apiKey })

      // Download image
      const downloaded = await FileSystem.downloadAsync(url, imagePath)
      if (!downloaded || !downloaded.uri) return false

      // Get image dimensions
      //const imageSize = await this.getImageSize({ uri: downloaded.uri })

      // Resize image
      //const imageCropped = await this.getCroppedImage({ uri: downloaded.uri, size: imageSize, mediaType })

      // Delete previous image
      //await FileSystem.deleteAsync(imagePath, { idempotent: true })

      // Move cropped image to new path
      //await FileSystem.moveAsync({ from: imageCropped, to: imagePath })

      if (typeof onProgress === 'function') {
        onProgress(movie.title)
      }

      return true
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message, serverKey: server.key } })
    }
  }
}

/**
 * [purge description]
 * @param  {[type]} movie     [description]
 * @param  {[type]} mediaType [description]
 * @return {[type]}           [description]
 */
export function purge({ movie, mediaType }) {
  return async dispatch => {
    try {
      const imagePath = `${config.mediaCover.root}/${mediaType}${movie.imdbId}.${config.mediaCover.ext}`
      await FileSystem.deleteAsync(imagePath, { idempotent: true })
      return true
    } catch (err) {
      if (__DEV__) console.warn(err)
      return dispatch({ type: TYPEAPP.SET_NOTIFICATION, payload: { type: 'error', message: err.message } })
    }
  }
}
