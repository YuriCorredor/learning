export default function bubble_sort(arr: number[]): void {
  let pointer = arr.length - 1

  while (pointer != 1) {
    for (let i = 0; i <= pointer ;i++) {
      const left = arr[i]
      const right = arr[i+1]

      if (left > right) {
        arr[i] = right
        arr[i+1] = left
      }
    }

    pointer -= 1
  }
}
