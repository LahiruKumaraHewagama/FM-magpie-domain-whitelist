"use client";
import Image from 'next/image';
import {
  useUser,
  UserButton,
  SignInButton,
  SignUpButton,
  useSession
} from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Header from "./components/header";
import Footer from "./components/footer";
import { useEffect } from 'react';
import { supabaseClient } from '../supabase/supabaseClinet';
import { initiateRole } from './superadmin/changerole/_actions';

export default function Home() {
  const { isSignedIn,user } = useUser();

  const router = useRouter();
  const { session } = useSession();

  useEffect(() => {
    const syncUserData = async () => {
      if (user) {

        if (!user.publicMetadata.role){
          initiateRole(user?.id,"moderator")
        }
        

        if (!session) return; // Check if session exists
        const supabaseAccessToken = await session.getToken({
          template: 'Supabase'
        }) as string;
        
        console.log(supabaseAccessToken);
        const supabase = await supabaseClient(supabaseAccessToken);

        // Check if user exists in Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('Error fetching user from Supabase:', error.message);
          return;
        }

        if (!data || data.length === 0) {
          console.error('Error fetching user from Supabase.')
          // User doesn't exist in Supabase, create a new user record
      
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({ user_id: user.id, email: user?.emailAddresses[0].emailAddress , role: user.publicMetadata.role ? (user.publicMetadata.role as string) : ("moderator") });

          if (createError) {
            console.error('Error creating user in Supabase:', createError.message);
            return;
          }
          console.log('User created in Supabase:', newUser);
        } else {
          
          // User exists in Supabase, update the user record if needed
          // Here you can compare and update user data as needed
          const { data, error } = await supabase
        .from('users')
        .update({ role: user.publicMetadata.role ? (user.publicMetadata.role as string) : ("moderator") })
        .eq('user_id', user.id);

        if (error) {
          console.error('Error updating user in Supabase:', error.message);
          return;
        }

        }
      }
    };

    syncUserData();
  }, [user]);


  if (isSignedIn) {
    router.push('/dashboard')
  }


  return (
    <main>
      <Header />

      <div className="flex min-h-screen flex-col p-10">
        {isSignedIn ? (
          <></>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-12">

            <div className='col-span-5'>
              <h3 className="font-mono font-bold text-slate-950 pt-10"> Research Project </h3>
              <h1 className=" font text-base sm:text-lg lg:text-xl font-bold text-slate-950 pb-5"> MAGPIE </h1>
              <h6 className=' text-sm text-zinc-800 pb-5'>To define standards and processes for temporary and permanent CI/CD pipelines and deployment options</h6>
              <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">
                <SignInButton>Get Start</SignInButton>
              </button>

            </div>
            <div className='col-span-1'></div>
            <div className='col-span-6 py-12'>
              <Image
                className="relative pl-1 dark:drop-shadow-[0_0_0.3rem_#ffffff70] animate-pulse"
                src="./fmlogo.svg"
                alt="Next.js Logo"
                width={500}
                height={200}
                priority
              />
            </div>

          </div>

        )}
      </div>
      <Footer />
    </main>
  );
};

