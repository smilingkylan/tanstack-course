import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/tanstack-start';
import { Button } from "./ui/button"
import { LightbulbIcon, ChartColumnBigIcon, SunIcon, MoonIcon } from "lucide-react"
import { useNavigate, Link } from "@tanstack/react-router";
import { useTheme } from './theme-provider';
import { Switch } from './ui/switch';

export const Header = () => {
  // get theme
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const isDark = theme === 'dark'
  return (
    <nav className="bg-background p-4 h-20 text-foreground flex items-center justify-between w-full">
      <Link to="/" className="flex gap-1 items-center font-bold text-2xl">
        Revel<LightbulbIcon className="text-lime-500" />
      </Link>
      <div className="text-white flex items-center">
        <div className="theme-switcher flex flex-row gap-2 items-center">
            <MoonIcon className="h-4 w-4 dark:text-white text-gray-700" />
            <Switch
              checked={isDark}
              className="data-[state=checked]:bg-white data-[state=unchecked]:bg-gray-700"
              onCheckedChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
        </div>
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