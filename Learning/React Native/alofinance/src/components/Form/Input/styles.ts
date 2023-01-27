import { RFValue } from "react-native-responsive-fontsize"
import styled from "styled-components/native"

export const Container = styled.TextInput`
  width: 100%;
  padding: 16px 18px;
  font-size: ${RFValue(14)}px;

  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.title};
  background-color: ${({ theme }) => theme.colors.shape};
  
  border-radius: 5px;
  margin-bottom: 8px;
`
