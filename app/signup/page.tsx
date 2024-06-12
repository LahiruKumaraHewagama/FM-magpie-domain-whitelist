'use client';
import * as React from 'react';
import { SignInButton, useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function Page() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [verifying, setVerifying] = React.useState(false);
    const [code, setCode] = React.useState('');
    const router = useRouter();

    // Function to check if the email domain is allowed
    const isEmailAllowed = (email: string) => {
        // List of allowed email domains
        const allowedDomains = ['favoritemedium.com'];

        const domain = email.substring(email.lastIndexOf('@') + 1);

        // Check if the domain is in the allowed domains list
        return allowedDomains.includes(domain);
    };

    // Handle submission of the sign-up form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoaded) return;

        // Check if the email domain is allowed
        if (!isEmailAllowed(emailAddress)) {
            console.error('Error: Email domain not allowed');
            alert('Error : Entered Email domain is not allowed. Please use \'favoritemedium.com\' domain!');
            // You can display an error message to the user here
            return;
        }

        // Start the sign-up process using the email and password provided
        try {
            await signUp.create({
                emailAddress,
                username,
                password,
            });

            // Send the user an email with the verification code
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            setVerifying(true);
        } catch (err: any) {
            alert('Error: ' + JSON.stringify(err.errors[0].message));
            console.error(JSON.stringify(err, null, 2));
        }
    };

    // Handle the submission of the verification form
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoaded) return;

        try {
            // Use the code the user provided to attempt verification
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            // If verification was completed, set the session to active
            // and redirect the user
            if (completeSignUp.status === 'complete') {
                await setActive({ session: completeSignUp.createdSessionId });
                router.push('/dashboard');
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (err: any) {
            alert('Error: ' + JSON.stringify(err.errors[0].message));
            console.error('Error:', JSON.stringify(err, null, 2));
        }
    };

    // Display the verification form to capture the OTP code
    if (verifying) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-12 pt-20 ">
                <div className='col-span-3' ></div>
                <div className='col-span-6 border border-blue-500 text-center mr-5 ml-5' style={{ color: '#000000' }}>
                    <h1 className='text-3xl font-bold pt-10 mb-2 font-mono text-blue-700 pl-6'>MAGPIE</h1>
                    < div style={{ color: "#000000" }}>
                       
                        <form onSubmit={handleVerify}>
                            <label id="code">Enter your verification code</label>
                            <input
                                value={code}
                                id="code"
                                name="code" style={{ "border": "1px solid #000000", "marginLeft": "10px", "marginBottom": "10px" }}
                                onChange={(e) => setCode(e.target.value)}
                            />
                                    <hr className="my-4 border-gray-200 ml-10 mr-10" />
                            <div>
                            <button type="submit" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded mb-10">Verify</button>

                            </div>
                            
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Display the initial sign-up form to capture the email and password
    return (
        <div className="grid grid-cols-1 sm:grid-cols-12 pt-20 ">
            <div className='col-span-3' ></div>
            <div className='col-span-6 border border-blue-500 text-center mr-5 ml-5' style={{ color: '#000000' }}>
                <h1 className='text-3xl font-bold pt-10 mb-5 font-mono text-blue-700 pl-6'>Sign Up - MAGPIE</h1>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Enter email address</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={emailAddress} style={{ "border": "1px solid #000000", "marginLeft": "10px", "marginBottom": "10px" }}
                            onChange={(e) => setEmailAddress(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="username">Enter username</label>
                        <input
                            id="username"
                            type="username"
                            name="username"
                            value={username} style={{ "border": "1px solid #000000", "marginLeft": "40px", "marginBottom": "10px" }}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Enter password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={password} style={{ "border": "1px solid #000000", "marginLeft": "40px", "marginBottom": "10px" }}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <hr className="my-4 border-gray-200 ml-10 mr-10" />
                    <div>

                        <button type="submit" className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent mb-10 rounded">Next</button>

                    </div>
                </form>
                <>or</>
                <p>Already have an account?</p>
                <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-1 px-4 border border-blue-500 hover:border-transparent rounded mb-10"><SignInButton /></button>
            </div>
        </div>
    );
}