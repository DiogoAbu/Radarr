/**
 * Radarr App
 * https://github.com/LetsMakeApps/Radarr
 * @flow
 */

//////////
// Main //
//////////
import React from 'react'
import { Modal as ModalBase, TouchableOpacity, View } from 'react-native'

/////////////////
// Third-party //
/////////////////
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons'

////////////
// Custom //
////////////
import selfStyle from './Modal.style'
import { theme } from 'src/constant'

//////////
// Init //
//////////
const Modal = props => {
  const { style, ...rest } = props
  return (
    <ModalBase
      animationType='fade'
      transparent={true}
      supportedOrientations={[ 'portrait', 'portrait-upside-down' ]}
      {...rest}
      style={props.styleModal}
    >
      <View style={[ selfStyle.outerContainer, props.styleOuter ]}>
        <TouchableOpacity
          activeOpacity={theme.touchableActiveOpacity}
          onPress={props.onRequestClose}
          style={selfStyle.iconContainer}
        >
          <Icon
            style={[ theme.style.text, selfStyle.icon ]}
            name='close-circle'
          />
        </TouchableOpacity>

        <View style={[ theme.style.viewVerticalCenter, selfStyle.container, style ]}>{props.children}</View>
      </View>
    </ModalBase>
  )
}

export default Modal
