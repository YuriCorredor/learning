import React from "react"
import HighlightCard from "../../components/HighlightCard"
import TransactionCard, { TransactionData } from "../../components/TransactionCard"
import {
  Container,
  Header,
  HighlightCards,
  Icon,
  Title,
  Transactions,
  TransactionsList,
  UserGreating,
  UserHello,
  UserImage,
  UserInfo,
  UserInfoContainer,
  UserName,
} from "./styles"

export interface DataListProps extends TransactionData {
  id: string;
}

export default function Dashboard() {
  const transactionData: DataListProps[] = [
    {
      id: '1',
      type: "positive",
      title: "Desenvolvimento de site",
      amount: "12.000,00",
      category: {
        name: "Vendas",
        icon: "dollar-sign",
      },
      date: "13/04/2021"
    },
    {
      id: '2',
      type: "negative",
      title: "Hamburgueria Pizzy",
      amount: "59,00",
      category: {
        name: "Alimentação",
        icon: "coffee",
      },
      date: "10/04/2021"
    },
    {
      id: '3',
      type: "negative",
      title: "Aluguel do apartamento",
      amount: "1.200,00",
      category: {
        name: "Casa",
        icon: "shopping-bag",
      },
      date: "27/03/2021"
    }
  ]

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
        <TransactionsList
          data={transactionData}
          renderItem={({ item }) => <TransactionCard data={item} />}
          keyExtractor={item => item.id}
        />

      </Transactions>
    </Container>
  )
}
