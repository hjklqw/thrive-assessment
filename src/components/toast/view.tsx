import { ToastContainer } from 'react-toastify'

export const Toast = () => (
  <ToastContainer
    position="top-center"
    autoClose={1000}
    hideProgressBar
    newestOnTop={false}
    closeOnClick
    pauseOnFocusLoss
    draggable
    pauseOnHover
    theme="light"
  />
)
