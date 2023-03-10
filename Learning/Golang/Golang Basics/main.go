package main

import (
	"basic/shared"
	"fmt"
	"sync"
	"time"
)

const conferenceName string = "GO Conference"
const conferenceTickets uint = 100

var remainingTickets uint = 100
var bookings []UserData

type UserData struct {
	firstName       string
	lastName        string
	email           string
	numberOfTickets uint
}

var wg = sync.WaitGroup{}

func main() {
	greatUser()

	for remainingTickets >= 0 {
		firstName, lastName, userTickets, email := getUserInput()
		isValidName, isValidTicketNumber := shared.ValidateUserInput(firstName, lastName, remainingTickets, userTickets)

		if isValidName && isValidTicketNumber {
			bookTicket(userTickets, firstName, lastName, email)
			// The go keyword makes the funciton run in another goroutine (another "Green thread")
			// Goroutines also have channels to allow communication between goroutines
			wg.Add(1)
			go sendTicket(userTickets, firstName, lastName, email)
			printFristNames()

			if remainingTickets == 0 {
				fmt.Println("Our conference is booked out. Come back next year!")
				break
			}
		} else {
			if !isValidName {
				fmt.Println("Please enter a valid first and last name.")
			}
			if !isValidTicketNumber {
				fmt.Printf("We only have %v tickets remaining. You can't book %v tickets.\n", remainingTickets, userTickets)
			}
		}
	}
	wg.Wait()
}

func greatUser() {
	fmt.Printf("Welcome to the %v.\n", conferenceName)
	fmt.Printf("We have a total of %v tickets and %v are still available.\n", remainingTickets, conferenceTickets)
}

func printFristNames() {
	firstNames := []string{}
	for _, userData := range bookings {
		firstNames = append(firstNames, userData.firstName)
	}
	fmt.Printf("These are all our bookings: %v\n\n", firstNames)
	fmt.Printf("These are all our bookings: %v\n\n", bookings)
}

func getUserInput() (string, string, uint, string) {
	var firstName string
	var lastName string
	var email string
	var userTickets uint
	fmt.Println("\nPlease enter your first name:")
	fmt.Scan(&firstName)

	fmt.Println("Please enter your last name:")
	fmt.Scan(&lastName)

	fmt.Println("Please enter your email:")
	fmt.Scan(&email)

	fmt.Println("How many tickets do you want?")
	fmt.Scan(&userTickets)

	return firstName, lastName, userTickets, email
}

func bookTicket(userTickets uint, firstName string, lastName string, email string) {
	remainingTickets = remainingTickets - userTickets

	// create a map for a user
	// maps can only contain one type of data
	// userData := make(map[string]string)
	// userData["firstName"] = firstName
	// userData["lastName"] = lastName
	// userData["numberOfTickets"] = strconv.FormatUint(uint64(userTickets), 10)

	userData := UserData{
		firstName:       firstName,
		lastName:        lastName,
		email:           email,
		numberOfTickets: userTickets,
	}

	bookings = append(bookings, userData)

	fmt.Printf("\nTank you, %v, you've just booked %v tickets.\n", firstName, userTickets)
	fmt.Printf("%v remaining tickets.\n", remainingTickets)
}

func sendTicket(userTickets uint, firstName string, lastName string, email string) {
	// simulate sending a ticket
	time.Sleep(10 * time.Second)
	ticket := fmt.Sprintf("%v tickets for %v %v", userTickets, firstName, lastName)
	fmt.Println("############")
	fmt.Printf("Sending %v ticket(s) to email address %v.\n", ticket, email)
	fmt.Println("############")
	wg.Done()
}
