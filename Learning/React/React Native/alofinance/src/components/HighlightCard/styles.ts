import styled, { css } from "styled-components/native"
import { Feather } from "@expo/vector-icons"
import { RFValue } from "react-native-responsive-fontsize"
import { IconType } from "."

export const Container = styled.View<{ type: IconType }>`
  background-color: ${({ theme, type }) => 
    type === 'total' ? theme.colors.secondary : theme.colors.shape
  };
  width: ${RFValue(300)}px;
  border-radius: 5px;
  padding: ${RFValue(18)}px ${RFValue(24)}px;
  padding-bottom: ${RFValue(42)}px;
  margin-left: ${RFValue(16)}px;
`

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`

export const Content = styled.View`

`

export const Title = styled.Text<{ type: IconType }>`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme, type }) => 
    type === 'total' ? theme.colors.shape : theme.colors.title
  };
`

export const Icon = styled(Feather)<{ type: IconType }>`
  font-size: ${RFValue(40)}px;

  ${({ type }) => type === "up" ? css`
    color: ${({ theme }) => theme.colors.success};
  ` : type === "down" ? css`
    color: ${({ theme }) => theme.colors.attention};
  ` : css`
    color: ${({ theme }) => theme.colors.shape};
  `}
`

export const Amount = styled.Text<{ type: IconType }>`
  font-family: ${({ theme }) => theme.fonts.medium};
  font-size: ${RFValue(32)}px;
  color: ${({ theme, type }) => 
    type === 'total' ? theme.colors.shape : theme.colors.title
  };
  margin-top: ${RFValue(32)}px;
`

export const LastTransaction = styled.Text<{ type: IconType }>`
  font-family: ${({ theme }) => theme.fonts.regular};
  font-size: ${RFValue(12)}px;
  color: ${({ theme, type }) => 
    type === 'total' ? theme.colors.shape : theme.colors.title
  };
`