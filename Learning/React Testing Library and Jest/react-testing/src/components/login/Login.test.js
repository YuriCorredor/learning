import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Login from './Login'

test('username input should be rendered', () => {
    render(<Login />)
    const userInputEl = screen.getByPlaceholderText(/username/i) 
    expect(userInputEl).toBeInTheDocument()
})

test('password input should be rendered', () => {
    render(<Login />)
    const passwordInputEl = screen.getByPlaceholderText(/password/i) 
    expect(passwordInputEl).toBeInTheDocument()
})

test('button should be rendered', () => {
    render(<Login />)
    const buttonEl = screen.getByRole("button") 
    expect(buttonEl).toBeInTheDocument()
})

test('password input should be empty', () => {
    render(<Login />)
    const passwordInputEl = screen.getByPlaceholderText(/password/i) 
    expect(passwordInputEl.value).toBe("")
})

test('username input should be empty', () => {
    render(<Login />)
    const userInputEl = screen.getByPlaceholderText(/username/i) 
    expect(userInputEl.value).toBe("")
})

test('button should be disabled', () => {
    render(<Login />)
    const buttonEl = screen.getByRole("button") 
    expect(buttonEl).toBeDisabled()
})

test('loading should not be rendered', () => {
    render(<Login />)
    const buttonEl = screen.getByRole("button") 
    expect(buttonEl).not.toHaveTextContent(/wait.../i)
})

test('error message should be invisible', () => {
    render(<Login />)
    const errorMessage = screen.getByTestId('error')
    expect(errorMessage).not.toBeVisible()
})

test('password input should change', () => {
    render(<Login />)
    const passwordInputEl = screen.getByPlaceholderText(/password/i)
    const testValue = "123456"

    fireEvent.change(passwordInputEl, { target: { value: testValue } })
    expect(passwordInputEl.value).toBe(testValue)
})

test('username input should change', () => {
    render(<Login />)
    const userInputEl = screen.getByPlaceholderText(/username/i)
    const testValue = "Testing"

    fireEvent.change(userInputEl, { target: { value: testValue } })
    expect(userInputEl.value).toBe(testValue)
})

test('button should not be disabled when inputs exist', () => {
    render(<Login />)

    const userInputEl = screen.getByPlaceholderText(/username/i)    
    const passwordInputEl = screen.getByPlaceholderText(/password/i)

    const testValue = "Testing"

    fireEvent.change(userInputEl, { target: { value: testValue } })
    fireEvent.change(passwordInputEl, { target: { value: testValue } })

    const buttonEl = screen.getByRole("button") 
    expect(buttonEl).toBeEnabled()
})

test('loading should be rendered when click', () => {
    render(<Login />)

    const userInputEl = screen.getByPlaceholderText(/username/i)    
    const passwordInputEl = screen.getByPlaceholderText(/password/i)

    const testValue = "Testing"

    fireEvent.change(userInputEl, { target: { value: testValue } })
    fireEvent.change(passwordInputEl, { target: { value: testValue } })

    const buttonEl = screen.getByRole("button") 
    fireEvent.click(buttonEl)

    expect(buttonEl).toHaveTextContent(/wait.../i)
})

test('loading should be rendered when click', () => {
    render(<Login />)

    const userInputEl = screen.getByPlaceholderText(/username/i)    
    const passwordInputEl = screen.getByPlaceholderText(/password/i)

    const testValue = "Testing"

    fireEvent.change(userInputEl, { target: { value: testValue } })
    fireEvent.change(passwordInputEl, { target: { value: testValue } })

    const buttonEl = screen.getByRole("button") 
    fireEvent.click(buttonEl)

    expect(buttonEl).toHaveTextContent(/wait.../i)
})

test('loading should not be rendered after fetching', async () => {
    render(<Login />)

    const userInputEl = screen.getByPlaceholderText(/username/i)    
    const passwordInputEl = screen.getByPlaceholderText(/password/i)

    const testValue = "Testing"

    fireEvent.change(userInputEl, { target: { value: testValue } })
    fireEvent.change(passwordInputEl, { target: { value: testValue } })

    const buttonEl = screen.getByRole("button") 
    fireEvent.click(buttonEl)

    await waitFor(() => expect(buttonEl).not.toHaveTextContent(/wait.../i))
})

test('username should be rendered after fetching', async () => {
    render(<Login />)

    const userInputEl = screen.getByPlaceholderText(/username/i)    
    const passwordInputEl = screen.getByPlaceholderText(/password/i)

    const testValue = "Testing"

    fireEvent.change(userInputEl, { target: { value: testValue } })
    fireEvent.change(passwordInputEl, { target: { value: testValue } })

    const buttonEl = screen.getByRole("button") 
    fireEvent.click(buttonEl)

    const userItem = await screen.findByText("Leanne Graham")

    expect(userItem).toBeInTheDocument()
})