import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/tanstack-start';
import { Button } from "./ui/button"
import { LightbulbIcon, ChartColumnBigIcon } from "lucide-react"
import { useNavigate, Link } from "@tanstack/react-router";
import { useTheme } from './theme-provider';

export const Header = () => {
  // get theme
  const { theme } = useTheme()
  const navigate = useNavigate()
  const isDark = theme === 'dark'
  return (
    <nav className="bg-background p-4 h-20 text-foreground flex items-center justify-between">
      <Link to="/" className="flex gap-1 items-center font-bold text-2xl">
        Revel<LightbulbIcon className="text-lime-500" />
      </Link>
      <div className="text-white flex items-center">
        <SignedOut>
          <Button asChild variant='link' className="text-white"><SignInButton /></Button>
          <div className="w-[1px] h-8 bg-zinc-700" />
          <Button asChild variant='link' className="text-white"><SignUpButton /></Button>
        </SignedOut>
        <SignedIn>
          <UserButton
            showName
            appearance={{
              elements: {
                // userButtonOuterIdentifier: { color: isDark ? 'red' },
              }
            }}
          >
            <UserButton.MenuItems>
              <UserButton.Action label="Dashboard" labelIcon={<ChartColumnBigIcon size={16} />} onClick={() => {
                navigate({ to: '/dashboard' })
              }} />
            </UserButton.MenuItems>
          </UserButton>
          <Button asChild variant='link'><SignOutButton /></Button>
        </SignedIn>
      </div>
    </nav>
  )
}