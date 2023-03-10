package shared

// FUNCTIONS WITH CAPITAL LETTER ARE AUTOMATICALLY EXPORTED

func ValidateUserInput(firstName string, lastName string, remainingTickets uint, userTickets uint) (bool, bool) {
	isValidName := len(firstName) >= 2 && len(lastName) >= 2
	isValidTicketNumber := userTickets > 0 && userTickets <= remainingTickets

	return isValidName, isValidTicketNumber
}
