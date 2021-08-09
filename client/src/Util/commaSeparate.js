export default function commaSeparate(array) {
  if (array.length === 1) {
    return `${array[0]}`
  }
  return `${array.slice(0, array.length-1).join(', ')}${array.length > 2 ? ',' : ''} and ${array[array.length-1]}`
}