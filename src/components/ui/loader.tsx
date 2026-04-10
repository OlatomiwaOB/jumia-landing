import { Loader2 } from 'lucide-react'
import React from 'react'

const Loader = ({text}:{text:string}) => {
  return (
    <div className='relative w-full h-full justify-center items-center flex flex-col gap-y-2.5'>
        <Loader2 size={24} className='animate-spin'/>
        <span className='text-center font-semibold text-xl'>{text}</span>
    </div>
  )
}

export default Loader