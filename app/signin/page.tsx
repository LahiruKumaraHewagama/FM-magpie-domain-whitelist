// Import necessary dependencies
'use client';
import * as React from 'react';
import { SignUpButton, useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation'; // Use next/router instead of next/navigation

// Define your functional component
export default function Page() {
  // Initialize the sign-in hook and router
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  // Define state variables to store user input
  const [emailAddress, setEmailAddress] = React.useState('');
  const [password, setPassword] = React.useState('');

  // Handle submission of the sign-in form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Start the sign-in process using the provided email and password
    try {
      const completeSignIn = await signIn?.create({
        // strategy: 'email', // Using the email/password strategy
        identifier: emailAddress,
        password: password,
      });


      // If sign-in is successful, redirect the user to the dashboard

      if (completeSignIn?.status === 'complete' && setActive) {
        await setActive({ session: completeSignIn.createdSessionId });
        router.push('/dashboard');
      }

    } catch (err: any) {
      // Handle sign-in errors
      console.error('Error:', JSON.stringify(err, null, 2));
      alert('Error: ' + JSON.stringify(err.errors[0].message));
    }
  };

  // Display the sign-in form
  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 pt-20 ">
      <div className='col-span-3' ></div>
      <div className='col-span-6 border border-blue-500 text-center mr-5 ml-5' style={{ color: '#000000' }}>
        <h1 className='text-3xl font-bold pt-10 mb-5 font-mono text-blue-700 pl-6'>Sign In - MAGPIE</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Enter email address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={emailAddress} style={{"border": "1px solid #000000", "marginLeft":"10px", "marginBottom":"10px"}}
              onChange={(e) => setEmailAddress(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Enter password</label>
            <input
              id="password"
              type="password"
              name="password"
              value={password} style={{"border": "1px solid #000000", "marginLeft":"40px", "marginBottom":"20px"}}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <hr className="my-4 border-gray-200 ml-10 mr-10" />
          <div>

            <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded mb-10" type="submit" >Sign In</button>

          </div>
        </form>
        <>or</>
        <p>Create an account?</p>
        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded mb-10"><SignUpButton /></button>
      </div>
      <div className='col-span-3' ></div>
    </div>

  );
}
