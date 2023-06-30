import { NavLinks } from '@/constants'
import Image from 'next/image'
import Link from 'next/link'
import AuthProviders from './AuthProviders'
import { getCurrentUser } from '@/lib/session'

const Navbar = async () => {
  const session = await getCurrentUser();

  return (
    <nav className="navbar flexBetween">
      <div className="flex-1 flexStart gap-10">
        <Link href="/">
          <Image 
            src="/logo.svg"
            width={115}
            height={43}
            alt="Flexibble logo"
          />
        </Link>

        <ul className="xl:flex hidden text-small gap-7">
          {NavLinks.map((link) => (
            <Link href={link.href} key={link.key}>
              {link.text}
            </Link>
          ))}
        </ul>
      </div>

      {/* Show login button */}
      <div className="flexCenter gap-4">
        {session?.user ? (
          <>
          {/* only show image if user is logged in */}
            {session?.user?.image && (
              <Image 
                src={session.user.image}
                width={40}
                height={40}
                alt="User avatar"
                className="rounded-full"
              />
            )}


            <Link href='/create-project'>
              Share Work
            </Link>
          </>
        ) : (
          <AuthProviders />        
        )}
      </div>
    </nav>
  )
}

export default Navbar