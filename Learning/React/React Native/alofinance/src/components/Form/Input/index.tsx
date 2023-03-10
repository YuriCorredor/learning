import React from "react"
import { TextInputProps } from "react-native"
import { Container } from "./styles"

interface InputProps extends TextInputProps {}

export default function Input({ ...props }: InputProps) {
  return (
    <Container {...props} />
  )
}
