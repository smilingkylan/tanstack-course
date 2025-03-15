import { Button } from '@/components/ui/button'
import { CreateNewAtomDialog } from '@/components/create-new-atom-dialog'
import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'

export const Route = createFileRoute('/')({
  component: Homepage,
})

function Homepage() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [isCreateAtomDialogOpen, setIsCreateAtomDialogOpen] = useState(false)

  const showCreateTriplePopup = () => {
    console.log('showCreateTriplePopup, dialogRef', dialogRef.current)
    dialogRef.current?.showModal()
  }

  return(
     <div id="homepage" className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-4">
          <h1 className="text-2xl font-bold block">Welcome to Revel8</h1>
          <Button onClick={showCreateTriplePopup} className="hover:cursor-pointer">Create New</Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Revel8 is a platform for creating and sharing ideas.
        </p>
      </div>
      <CreateNewAtomDialog ref={dialogRef} />
     </div>
  )
}
