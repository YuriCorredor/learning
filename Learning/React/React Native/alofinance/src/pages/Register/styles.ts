import { RFValue } from "react-native-responsive-fontsize"
import styled from "styled-components/native"

export const Container = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
`

export const Header = styled.View`
  width: 100%;
  padding-top: ${RFValue(68)}px;
  padding-bottom: 20px;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
`

export const Title = styled.Text`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(18)}px;
  color: ${({ theme }) => theme.colors.shape};
`

export const Form = styled.View`
  flex: 1;
  width: 100%;
  padding: 24px;
`

export const Fields = styled.View`
  flex: 1;
  width: 100%;
`