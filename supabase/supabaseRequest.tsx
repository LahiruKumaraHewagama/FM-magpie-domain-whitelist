"use client"
import { useState, useEffect } from 'react';
import { useSession } from '@clerk/nextjs';
import { supabaseClient } from './supabaseClinet';

interface Note {
  id: number;
  content: string;
}

interface NoteListProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const NoteList: React.FC<NoteListProps> = ({ notes, setNotes }) => {
  const { session } = useSession();
  const [loadingNotes, setLoadingNotes] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoadingNotes(true);
        if (!session) return; // Check if session exists
        const supabaseAccessToken = await session.getToken({
          template: 'Supabase'
        }) as string;
        console.log("||||||");
        console.log(supabaseAccessToken);
        const supabase = await supabaseClient(supabaseAccessToken);
        const { data: fetchedNotes } = await supabase.from('notes').select('*');
        setNotes(fetchedNotes || []);

      } catch (e) {
        alert(e);
      } finally {
        setLoadingNotes(false);
      }
    };
    loadNotes();
  }, [session, setNotes]);

  const handleDelete = async (id: number) => {
    try {
      if (!session) return; // Check if session exists
      const supabaseAccessToken = await session.getToken({
        template: 'Supabase'
      }) as string;
      const supabase = await supabaseClient(supabaseAccessToken);
      const { error } = await supabase.from('notes').delete().eq('id', id);
      if (error) {
        console.log("Error")
        alert(error.message);
        return;
      }
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    } catch (error) {
      alert("error");
    }
  };

  if (!session || loadingNotes) {
    return <div className='text-zinc-800'>Loading...</div>;
  }

  return (
    <>
      {notes?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-6" style={{ gap: '0.5rem' }}>
          {notes.map(note => (
            <div key={note.id} className="col-span-3 bg-white p-4 border border-sky-600 rounded-lg shadow" style={{ background: '#ffffff' }}>
              <div>
                <p className="mb-2 text-md font-bold tracking-tight" style={{ color: '#03adfc' }}>NOTE {note.id}</p>
                <p className="font-normal text-gray-700 dark:text-gray-400 text-sm" style={{ color: '#03adfc' }}>{note.content}</p>
              </div>
              <div className='mt-4 pb-1'>
                <hr className="my-4 border-gray-200" />
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-6'>
                <div key={note.id} className="col-span-5"></div>
                <div key={note.id} className="col-span-1">

                  <button onClick={() => handleDelete(note.id)} className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4" style={{ backgroundColor: "red" }}>
                    X
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h6 className=' text-sm text-zinc-800 pb-1'>Sorry.You don&apos;t have any notes yet</h6>
      )}
    </>
  );
};

interface AddNoteFormProps {
  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;
}

export const AddNoteForm: React.FC<AddNoteFormProps> = ({ notes, setNotes }) => {
  const { session } = useSession();
  const [newNote, setNewNote] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session || newNote === '') return; // Check if session exists

    const supabaseAccessToken = await session.getToken({
      template: 'Supabase'
    }) as string;
    const supabase = await supabaseClient(supabaseAccessToken);
    const { data: newData, error } = await supabase.from('notes').insert({ content: newNote, user_id: session.user.id }).select();
    if (error) {
      alert(error.message);
      return;
    }

    if (newData) {
      const newNoteData = newData[0];
      setNotes(prevNotes => [...prevNotes, newNoteData]);
    }
    setNewNote('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <input className="text-black border border-slate-900" style={{ width: '100%', height: '80px', color: '#000000', paddingLeft: '10px', paddingRight: '10px' }} onChange={e => setNewNote(e.target.value)} value={newNote} />
        </div>
        <div className='pt-5 pb-5'>
          <button className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" style={{ backgroundColor: "blue" }}>
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

