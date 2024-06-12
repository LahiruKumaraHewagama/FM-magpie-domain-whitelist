"use client";
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton
} from '@clerk/nextjs'
import Link from 'next/link';

const Header: React.FC = () => {
  const { isSignedIn, user } = useUser();

  return (

    <header className="header p-4">
      <div className="grid grid-cols-1 sm:grid-cols-12 items-end">

        {isSignedIn ? (
          <>
            <div className='col-span-10'>
              {/* disply on md and lg */}
              <div className="sm:block hidden">
                <code className="font-mono font-bold  text-blue-500 pl-6"> MAGPIE </code>
              </div>
              {/* disply on sm */}
              <div className="md:hidden">
                <code className="font-mono font-bold  text-blue-500 pl-5 mr-20"> MAGPIE </code>
                {user?.publicMetadata.role == "super_admin" ? (
                  <><Link href="/dashboard" style={{ color: "skyblue", paddingRight: "10px",paddingLeft: "50px" }}>Home</Link>
                    <Link href="/superadmin/changerole" style={{ color: "skyblue", paddingRight: "20px" }}>S-Admin</Link></>) : (<Link href="/dashboard" style={{ color: "skyblue", paddingRight: "20px", paddingLeft: "100px" }}>Home</Link>)}
                < UserButton />
              </div>
            </div>

            <div className="col-span-2 sm:block hidden pt-5">
              {user?.publicMetadata.role == "super_admin" ? (
                <><Link href="/dashboard" style={{ color: "skyblue", paddingRight: "10px" }}>Home</Link>
                  <Link href="/superadmin/changerole" style={{ color: "skyblue", paddingRight: "20px" }}>S-Admin</Link></>) : (<Link href="/dashboard" style={{ color: "skyblue", paddingRight: "20px" }}>Home</Link>)}
              < UserButton />
            </div>

          </>
        ) : (
          <>
            <div className='col-span-10'>
              <code className="font-mono font-bold  text-blue-700 pl-6"> MAGPIE </code>
            </div>
            <div className="col-span-2 sm:block hidden">
              <div className="grid grid-cols-1 sm:grid-cols-6">
                <div className="col-span-3">
                  <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded"><SignInButton /></button>
                </div>
                <div className="col-span-3">
                {/* <Link href="/signup" style={{ color: "skyblue", paddingRight: "10px" }}>register</Link> */}
                  <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded"><SignUpButton /></button>
                </div>
              </div>
            </div>
          </>
        )}


      </div>
    </header>

  );
};

export default Header;
