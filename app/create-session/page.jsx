import AttachSessionDetails from '@/components/AttachSessionDetails'
import React from 'react'
import CreateListingForm from './CreateSession'

const page = async ({searchParams}) => {
  const id = (await searchParams).id

  return (
    <div>
      <AttachSessionDetails id = {id} Component ={CreateListingForm}/>
    </div>
  )
}

export default page
