import axios from 'axios'

export default axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
})

// Removed invalid export as 'AR' is a type alias and cannot be used as a value.
