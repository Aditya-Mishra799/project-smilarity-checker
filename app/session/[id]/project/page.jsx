import AttachSessionDetails from '@/components/AttachSessionDetails'
import React from 'react'
import CreateOrUpadateProject from './CreateOrUpadateProject'

const page = async ({params, searchParams}) => {
  const projectId = (await searchParams).projectId
  const id = (await params).id

  return (
    <div>
      <AttachSessionDetails id = {id} projectId = {projectId} Component ={CreateOrUpadateProject}/>
    </div>
  )
}

export default page
