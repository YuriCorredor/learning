 import React from "react"
import {
  Amount,
  Container,
  Content, Header,
  Icon,
  LastTransaction,
  Title,
} from "./styles"

export type IconType = "up" | "down" | "total"

interface HighlightCardProps {
  type: IconType;
  title: string,
  amount: string;
  lastTransaction: string;
}

const iconTypeMap = {
  up: 'arrow-up-circle',
  down: 'arrow-down-circle',
  total: 'dollar-sign',
}
 
 export default function HighlightCard({
  title = "Entradas",
  amount,
  lastTransaction,
  type,
 }: HighlightCardProps) {
   return (
      <Container type={type}>
        <Header>
          <Title type={type}>{title}</Title>
          <Icon name={iconTypeMap[type]} type={type} />
        </Header>
        <Content>
          <Amount type={type}>R$ {amount}</Amount>
          <LastTransaction type={type}>{lastTransaction}</LastTransaction>
        </Content>
      </Container>
   )
 }
 