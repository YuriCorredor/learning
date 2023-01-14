import styled from "styled-components/native"
import { RFPercentage, RFValue } from "react-native-responsive-fontsize"
import { Feather } from "@expo/vector-icons"
import { FlatList } from "react-native"
import { DataListProps } from "."

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`

export const Header = styled.SafeAreaView`
  background-color: ${({ theme}) => theme.colors.primary};
  padding: ${RFPercentage(8)}px ${RFPercentage(3)}px;
  height: ${RFPercentage(42)}px;
  align-items: flex-start;
  justify-content: center;
  flex-direction: row;
`

export const UserInfoContainer = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const UserInfo = styled.View`
  flex: 1;
  flex-direction: row;
`

export const UserImage = styled.Image`
  width: ${RFValue(55)}px;
  height: ${RFValue(55)}px;
  border-radius: 10px;
`

export const UserGreating = styled.View`
  flex: 1;
  flex-direction: column;
  padding-left: ${RFPercentage(2)}px;
`

export const UserHello = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFPercentage(3)}px;
  color: ${({ theme }) => theme.colors.shape};
`

export const UserName = styled.Text`
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: ${RFPercentage(3)}px;
  color: ${({ theme }) => theme.colors.shape};
`

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.title};
  margin-bottom: ${RFValue(12)}px;
`

export const Icon = styled(Feather)`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: ${RFValue(24)}px;
`

export const HighlightCards = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
  contentContainerStyle: { paddingRight:  RFValue(16) }
})`
  width: 100%;
  position: absolute;
  margin-top: ${RFPercentage(20)}px;
`

export const Transactions = styled.View`
  flex: 1;
  padding: 0 ${RFPercentage(3)}px;
  margin-top: ${RFPercentage(12)}px;
`

export const TransactionsList = styled(FlatList<DataListProps>).attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    paddingBottom: RFPercentage(10)
  }
})`
  margin-top: ${RFPercentage(2)}px;
`
