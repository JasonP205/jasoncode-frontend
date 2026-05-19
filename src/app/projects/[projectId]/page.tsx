import React from 'react'

const page =async  (props : PageProps<'/projects/[projectId]'>) => {
    const params  = await props.params
    const projectId = params.projectId
    console.log(projectId)
  return (
    <div>page</div>
  )
}

export default page