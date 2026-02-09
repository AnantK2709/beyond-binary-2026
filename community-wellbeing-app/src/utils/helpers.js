export const truncateText = (text, maxLength = 100) => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export const capitalizeFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const getRandomColor = () => {
  const colors = ['sage', 'ocean', 'green', 'blue', 'purple', 'pink']
  return colors[Math.floor(Math.random() * colors.length)]
}
