/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import { Asset } from 'expo'
import { Image } from 'react-native'

/////////////////
// Third-party //
/////////////////

////////////
// Custom //
////////////

//////////
// Init //
//////////
export default imageList => {
  return imageList.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image)
    } else {
      return Asset.fromModule(image).downloadAsync()
    }
  })
}
