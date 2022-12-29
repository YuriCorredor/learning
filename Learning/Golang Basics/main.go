package main

import "fmt"

func main() {

	// strings
	var nameOne string = "Bowser"
	var nameTwo = "Luigi" // Type inferred - string
	var nameThree string  // Setting up the variable for future use
	nameThree = "Mario"
	nameFour := "Yoshi" // Type inferred - string (short-hand for 'var nameFour string = "Yoshi"') - only work inside functions

	fmt.Println(nameOne, nameTwo, nameThree, nameFour)

	// integers and floats
	var ageOne int = 10
	var ageTwo = 20
	ageThree := 30
	var scoreOne float32 = -1887.5
	var scoreTwo float64 = 54544664546546564568465446546564565464564.888
	scoreThree := 887.5 // inferred as float32

	// bits and memory
	var numOne int8 = 25   // int8 range from -128 through 127. https://go.dev/doc/
	var numTwo uint = 1280 // only positives numbers

	fmt.Println(ageOne, ageTwo, ageThree, numOne, numTwo, scoreOne, scoreTwo, scoreThree)

}
