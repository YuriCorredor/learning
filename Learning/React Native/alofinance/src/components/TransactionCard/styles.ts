import styled from "styled-components/native"
import { Feather } from "@expo/vector-icons"
import { RFValue } from "react-native-responsive-fontsize"
import { TransactionType } from "."

export const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.shape};
  border-radius: 5px;
  padding: ${RFValue(17)}px ${RFValue(24)}px;
  margin-right: 16px;
  margin-bottom: ${RFValue(16)}px;
`  

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`

export const Amount = styled.Text<{ type: TransactionType }>`
  font-size: ${RFValue(20)}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  margin-top: ${RFValue(2)}px;

  color: ${({ theme, type }) => type === 'positive' ? theme.colors.success : theme.colors.attention};
`

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${RFValue(20)}px;
`

export const Category = styled.View`
  flex-direction: row;
  align-items: center;
`

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({ theme }) => theme.colors.text};
  margin-right: ${RFValue(18)}px;
`

export const CategoryName = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
`

export const Date = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.text};
`