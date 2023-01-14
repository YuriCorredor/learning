import React from "react"
import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date,
} from "./styles"

interface Category {
  name: string;
  icon: string;
}

export type TransactionType = "positive" | "negative";

export interface TransactionData {
  type: TransactionType;
  title: string;
  amount: string;
  category: Category;
  date: string;
}

interface TransactionCardProps {
  data: TransactionData;
}

export default function TransactionCard({ data: {
  type,
  title,
  amount,
  category,
  date
} }: TransactionCardProps) {
  return (
    <Container>
      <Title>{title}</Title>
      <Amount type={type}>{type === 'negative' && '- '}R$ {amount}</Amount>
      <Footer>
        <Category>
          <Icon name={category.icon} />
          <CategoryName>{category.name}</CategoryName>
        </Category>
        <Date>{date}</Date>
      </Footer>
    </Container>
  )
}
