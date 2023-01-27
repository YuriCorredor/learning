import React from "react"
import Button from "../../components/Form/Button"
import Input from "../../components/Form/Input"
import { Container, Header, Title, Fields, Form } from "./styles"

export default function Register() {
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>
      <Form>
        <Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Preço" />
        </Fields>
        <Button title="Enviar" />
      </Form>
    </Container>
  )
}
