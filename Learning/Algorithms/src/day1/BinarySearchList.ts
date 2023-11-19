export default function bs_list(haystack: number[], needle: number): boolean {
  let left = 0
  let right = haystack.length - 1

  while (right >= left) {
    let middle = Math.floor((left + right) / 2)
    const guess = haystack[middle]

    if (guess === needle) {
      return true
    } else if (guess < needle) {
      left = middle + 1
    } else if (guess > needle) {
      right = middle - 1
    }
  }

  return false
}

