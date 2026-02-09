export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email) return 'Email is required'
  if (!re.test(email)) return 'Please enter a valid email'
  return null
}

export const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return null
}

export const validateName = (name) => {
  if (!name) return 'Name is required'
  if (name.length < 2) return 'Name must be at least 2 characters'
  return null
}

export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || value.toString().trim() === '') {
    return `${fieldName} is required`
  }
  return null
}

export const validateForm = (values, rules) => {
  const errors = {}

  Object.keys(rules).forEach(field => {
    const validator = rules[field]
    const error = validator(values[field])
    if (error) {
      errors[field] = error
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}
