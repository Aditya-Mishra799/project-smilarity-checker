import AttachSessionDetails from '@/components/AttachSessionDetails'
import React from 'react'
import CreateListingForm from './CreateSession'

const page = async ({params}) => {
  const id = (await params).id

  return (
    <div>
      <AttachSessionDetails id = {id} Component ={CreateListingForm}/>
    </div>
  )
}

export default page
