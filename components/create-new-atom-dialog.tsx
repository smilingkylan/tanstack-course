import { forwardRef } from "react"

export const CreateNewAtomDialog = forwardRef<HTMLDialogElement>((props, ref) => {
  return (
    <dialog className="p-16 bg-transparent w-full h-full flex flex-col items-center justify-center" ref={ref} onClick={() => ref?.current?.close()}>
      <div className="border border-red-500 h-3/4 w-2/3">
        this is a modal
      </div>
    </dialog>
  )
})

CreateNewAtomDialog.displayName = 'CreateNewAtomDialog'