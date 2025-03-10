import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: ({ context }) => {
    if (!context.userId) {
      redirect({ to: '/', throw: true })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authed"!</div>
}
