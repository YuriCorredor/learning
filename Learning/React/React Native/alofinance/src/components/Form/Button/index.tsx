import React from "react"
import { TouchableOpacityProps } from "react-native"
import { Container, Title } from "./styles"

interface Props extends TouchableOpacityProps {
  title: string;
}

export default function Button({ title, ...props }: Props) {
  return (
    <Container {...props}>
      <Title>{title}</Title>
    </Container>
  )
}
