import React from "react"
import HighlightCard from "../../components/HighlightCard"
import TransactionCard from "../../components/TransactionCard"
import {
  Container,
  Header,
  HighlightCards,
  Icon,
  Title,
  Transactions,
  UserGreating,
  UserHello,
  UserImage,
  UserInfo,
  UserInfoContainer,
  UserName,
} from "./styles"

export default function Dashboard() {
  return (
    <Container>
      <Header>
        <UserInfoContainer>
          <UserInfo>
            <UserImage source={{ uri: 'https://avatars.githubusercontent.com/u/91801065?v=4' }} />
            <UserGreating>
              <UserHello>Olá,</UserHello>
              <UserName>Corredor</UserName>
            </UserGreating>
          </UserInfo>
          <Icon name="power" />
        </UserInfoContainer>
      </Header>
      <HighlightCards>
        <HighlightCard 
          title="Entradas"
          amount="17.400,00"
          lastTransaction="Última entrada dia 13 de abril"
          type="up"
        />
        <HighlightCard
          title="Saídas"
          amount="1.259,00"
          lastTransaction="Última saída dia 03 de abril"
          type="down"
        />
        <HighlightCard
          title="Total"
          amount="16.141,00"
          lastTransaction="01 à 06 de abril"
          type="total"
        />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionCard />
      </Transactions>
    </Container>
  )
}
