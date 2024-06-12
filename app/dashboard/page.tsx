"use client";
import React, { useEffect, useState } from 'react';
import { AddNoteForm, NoteList } from '../../supabase/supabaseRequest';
import { useSession, useUser } from '@clerk/nextjs';
import Header from '../components/header';
import Footer from '../components/footer';
import { initiateRole } from '../superadmin/changerole/_actions';
import { supabaseClient } from '@/supabase/supabaseClinet';

const Dashboard = () => {
  const [notes, setNotes]: any[] = useState(null);
  const { isSignedIn, user } = useUser();
  const { session } = useSession();

  console.log(user?.publicMetadata.role);
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

  return (
    <>
      <Header />
      <div className="flex min-h-screen flex-col p-10">
        <div className="grid grid-cols-1 sm:grid-cols-12">
          <div className='col-span-5'>
            <div className="text-4xl font-semibold text-slate-900 mb-1">Welcome  <span className=' text-slate-600 text-3xl'>{user?.username}</span></div>
            <div className="text-2xl font-semibold text-slate-900 mb-4">to MAGPIE</div>

            <h6 className=' text-sm text-zinc-800 pb-1'>Please put your note here ,</h6>
            <AddNoteForm notes={notes} setNotes={setNotes} />
          </div>
          <div className='col-span-1'>
          </div>
          <div className='col-span-5'>
            <div className="text-2xl  font-sans font-semibold text-slate-900 mb-4">Your Notes</div>
            <NoteList notes={notes} setNotes={setNotes} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Dashboard