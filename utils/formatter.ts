 export const replaceSpacesWithPlus = (input: string): string => {
      return input.replace(/ /g, '+')
}

// format date
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

export const formatCurrency = (amount: number, currencySymbol = '₱'): string => {
  return `${currencySymbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export const getDaysFromToday = (dateValue: string | Date): number | null => {
  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) return null

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const compareDate = new Date(date)
  compareDate.setHours(0, 0, 0, 0)

  const millisecondsPerDay = 24 * 60 * 60 * 1000
  return Math.ceil((compareDate.getTime() - today.getTime()) / millisecondsPerDay)
}

export const formatDueDateLabel = (dateValue: string | Date): string => {
  const days = getDaysFromToday(dateValue)
  if (days === null) return 'No due date'

  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'

  return `Due in ${days} days`
}