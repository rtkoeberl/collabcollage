export default function commaSeparate(array, separator = 'and') {
  if (!array.length) {
    return '';
  }

  if (array.length === 1) {
    return `${array[0]}`
  }
  return `${array.slice(0, array.length-1).map(i => i.replace(/\s\(\d+\)/ig, '')).join(', ')}${array.length > 2 ? ',' : ''} ${separator} ${array[array.length-1].replace(/\s\(\d+\)/ig, '')}`
}