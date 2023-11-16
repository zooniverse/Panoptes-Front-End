/*
Moves an item in an array.

- Input: array of whatever, index of item to be moved from, index to move item to.
- Output: returns a COPY of the array, with the items moved.

Examples:
- moveItemInArray(['a','b','c','d','e'], 2, 3) => ['a', 'b', 'd', 'c', 'e']
- moveItemInArray(['a','b','c','d','e'], 2, 1) => ['a', 'c', 'b', 'd', 'e']
 */

export default function moveItemInArray(
  array = [],
  from = -1,
  to = -1
) {
  if (from < 0 || to < -1 || from >= array.length || to >= array.length) {
    throw new Error('moveItemInArray: invalid "to" or "from" index values.');
  }
  
  const newArray = array.slice();  // Create a copy of the original array that we can modify
  newArray.splice((from < to) ? to + 1 : to, 0, array[from]);  // Add item to destination position
  newArray.splice((from < to) ? from : from + 1, 1);  // Remove item from old position

  return newArray;
}
