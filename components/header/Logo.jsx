import { HousePlus, Notebook } from 'lucide-react'
import React from 'react'

const Logo = () => {
  return (
    <div className='flex gap-2 items-center'>
        <h1 className='text-xl font-bold tracking-wider uppercase text-gray-800 md:text-2xl'>Project Manager</h1>
        <Notebook className="w-6 h-6 text-indigo-500 md:w-8 md:h-8" />
    </div>
  )
}

export default Logo
