import React from 'react'
import Toast from './Toast'

const ToastContainer = ({toasts}) => {
  return (
    <div className='fixed bottom-4 right-4 z-50 flex flex-col space-y-4'>
        {
            toasts.map(toast => (<Toast key={toast?.id} {...toast} />))
        }
    </div>
  )
}

export default ToastContainer
