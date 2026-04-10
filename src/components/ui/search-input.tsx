import React from 'react'
import { Button } from './button'
import { Input } from './input'
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation'

const SearchInput = ({ onClose }:{ onClose: () => void }) => {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = React.useState("")
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        router.push(`?name=${searchTerm}`)
    }


    

  return (
    <form className="absolute backdrop-blur-md top-0 h-[68px] flex items-center justify-center gap-2 inset-0 bg-transparent z-50 p-4" onSubmit={handleSearchSubmit}>
        <div className='w-[clamp(300px,100%,600px)] relative'>
            <Input
              placeholder="Search..."
              type='text'
              className='border-accent w-full p-3 focus:ring-accent focus-within:border-accent'
              onChange={handleSearchChange}
            />
            {/* <button type='button' className='absolute right-4 top-[50%]'>
              <X className='h-5 w-5' />
            </button> */}
        </div>
        <Button type='button' className='bg-gray-100 cursor-pointer ring-accent hover:bg-transparent border-accent border p-1' onClick={onClose}>
            <X className='h-5 w-5 text-accent' />
        </Button>
    </form>
  )
}

export default SearchInput