/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import Expo from 'expo'
import { AsyncStorage } from 'react-native'

/////////////////
// Third-party //
/////////////////
import I18n from './i18n'
import moment from 'moment'
require('moment/min/locales.min')

////////////
// Custom //
////////////
import * as localeList from './locale'

import { config } from 'src/constant'

//////////
// Init //
//////////
// Locale identifier: https://pt.wikipedia.org/wiki/Internacionaliza%C3%A7%C3%A3o_(inform%C3%A1tica)#Conceito_de_Locale
I18n.translations = { ...localeList }

// en-GB => en
I18n.fallbacks = true

// In case requested locale does not exists
I18n.defaultLocale = 'en'

// Guess string from key: "whatIsYourFavorite_ChristmasPresent" => "what is your favorite Christmas present"
I18n.missingBehaviour = 'guess'
I18n.missingTranslationPrefix = __DEV__ ? '[I18n]: ' : ''

// Set available locales
I18n.availableLocales = Object.keys(localeList)

// Store locale and update translation
I18n.changeLocale = async localeToSet => {
  let locale = localeToSet ? localeToSet.replace(/_/, '-') : I18n.defaultLocale

  if (!I18n.availableLocales.includes(locale)) {
    locale = I18n.defaultLocale
  }

  // Set new locale
  I18n.locale = locale

  // Set locale on moment
  moment.locale(locale)

  // Store new locale
  await AsyncStorage.setItem(config.storageKey.locale, locale)
}

// Initialize
I18n.initAsync = async () => {
  let locale

  // Get locale from storage
  const localeStored = await AsyncStorage.getItem(config.storageKey.locale)

  // Use stored one or get from system
  if (localeStored) {
    locale = localeStored
  } else {
    // Get locale from system
    locale = await Expo.Util.getCurrentLocaleAsync()
  }

  await I18n.changeLocale(locale)
}

export default I18n
