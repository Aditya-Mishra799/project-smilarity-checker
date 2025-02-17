import AttachSessionDetails from '@/components/AttachSessionDetails'
import React from 'react'
import AddListingForm from '../AddListingForm'

const page = async ({params}) => {
  const id = (await params).id

  return (
    <div>
      <AttachSessionDetails id = {id} Component ={AddListingForm}/>
    </div>
  )
}

export default page
