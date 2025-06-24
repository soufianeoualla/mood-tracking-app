import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader = () => {
  return (
    <div className="flex justify-center items-center h-screen">
    <Loader2 className="text-blue-600 w-16 h-16 animate-spin" />
  </div>
  )
}

export default Loader