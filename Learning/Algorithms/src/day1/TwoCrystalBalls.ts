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

  for (let i = floor - jumpAmount; i < floor; ++i) {
    if (breaks[i]) {
      return i
    }
  }

  return -1
}
