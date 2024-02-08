/*
Question:
You have two crystal balls, and you want to determine the highest floor of an n-story building an egg can be dropped from without breaking.
Each ball has the following properties:
- If dropped from floor F or below, it will not break.
- If dropped from floor F + 1 or above, it will break.
- If dropped from any floor between F and F + 1, the result is unknown.
What's the best strategy for determining F while dropping the smallest number of balls?

Examples:
Input: [false, false, false, false, true, true, true, true]
Output: 4

Input: [false, false, false, false, false, false, false, false]
Output: -1

Input: [true, true, true, true, true, true, true, true]
Output: 0
*/
export default function two_crystal_balls(breaks: boolean[]): number {
  const jumpAmount = Math.floor(Math.sqrt(breaks.length))
  let floor = jumpAmount

  for (let i = 0; i < breaks.length; i += jumpAmount) {
    if (breaks[i]) {
      floor = i
      break
    }
  }

  for (let i = floor - jumpAmount; i <= floor; ++i) {
    if (breaks[i]) {
      return i
    }
  }

  return -1
}

/*
  Using binary search (time complexity for this case specifically is O(n) instead of O(log n))
  After the binary search part, the algorithm performs a linear search from the beginning of the
  array up to the middle index found by the binary search. Meaning that the time complexity is
  O(log n + n/2) = O(n/2) = O(n)
*/
export function two_crystal_balls_bs(breaks: boolean[]): number {
  let left = 0
  let right = breaks.length - 1
  let middle = 0

  while (right >= left) {
    middle = Math.floor((right + left) / 2)

    const guess = breaks[middle]

    if (guess) {
      break
    } else {
      left = middle + 1
    }
  }

  for (let i = 0; i <= middle; i++) {
    if (breaks[i]) {
      return i
    }
  }

  return -1
}
