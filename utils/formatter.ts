 export const replaceSpacesWithPlus = (input: string): string => {
      return input.replace(/ /g, '+')
}

// format date
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}