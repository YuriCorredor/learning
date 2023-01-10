import React from 'react'
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native'

interface ComponentProps extends TouchableOpacityProps {
  title?: string,
  titleStyle?: object,
  type?: 'primary' | 'default',
}

export default function Button({ 
  children,
  title,
  titleStyle, 
  type = 'default',
  style,
  ...props
}: ComponentProps) {
  style = style ? [styles[type as keyof typeof styles], style] : styles[type as keyof typeof styles]

  return (
    <TouchableOpacity style={style} {...props}>
      {title && <Text style={titleStyle}>{title}</Text>}
      {children}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: '#a370f7',
    padding: 10,
    paddingHorizontal: 25,
    marginTop: 10,
    borderRadius: 7,
  },
  default: {}
})
