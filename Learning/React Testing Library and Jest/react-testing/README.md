# Learning React Testing Library and Jest

## JEST VS REACT TESTING

This statment is not correct, they are not built to do the same thing, they actually work together. First we need to reach our DOM elements and to reach them we use React Testing Library through [queries](https://testing-library.com/docs/queries/about). "Queries are the methods that Testing Library gives you to find elements on the page. There are several types of queries ("get", "find", "query"); the difference between them is whether the query will throw an error if no element is found or if it will return a Promise and retry. Depending on what page content you are selecting, different queries may be more or less appropriate.". Also, with React Testing Library we can interact with our DOM elements, [Firing Events](https://testing-library.com/docs/dom-testing-library/api-events), like clicking on a button or writing on a input field.

When we're writing tests, we often need to check that values meet certain conditions. That's where Jest comes into our hands, it serves this purpose. Jest, with [Expect](https://jestjs.io/docs/expect) gives us access to a number of "matchers" that let us validate different things.

## Test-driven development

"Test-driven development (TDD) is a software development process relying on software requirements being converted to test cases before software is fully developed, and tracking all software development by repeatedly testing the software against all test cases. This is as opposed to software being developed first and test cases created later."

<br>

That's the methodology I'm going to apply here to write a simple Login component.

```
src/components --> Login.js and Login.test.js
```