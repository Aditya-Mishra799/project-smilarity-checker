import React from 'react'

const ErrorLabel = ({message}) => {
  return (
    message && <span className="text-red-500 text-sm mt-1">{message}</span>
  )
}

export default ErrorLabel