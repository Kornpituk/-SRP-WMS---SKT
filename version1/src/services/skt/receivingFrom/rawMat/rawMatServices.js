// utils.js
export const validateTextInput = input => {
  const lines = input.split('\n')
  if (lines.length > 4) {
    return { valid: false, message: 'Cannot exceed 4 lines.' }
  }
  for (const line of lines) {
    if (line.length > 130) {
      return { valid: false, message: 'Each line cannot exceed 130 characters.' }
    }
  }
  
  return { valid: true }
}
