import { SearchUsers } from "./_search-users";
import { clerkClient } from "@clerk/nextjs/server";
import { setRole } from "./_actions";
import Header from "@/app/components/header";

export default async function AdminDashboard(params: {
    searchParams: { search?: string };
}) {
    let query= ""
    if (params.searchParams.search){
         query = params.searchParams.search.toUpperCase() as string; // Convert query to uppercase
    }
    
    let users: any[];
    try {
        users = query ? (await clerkClient.users.getUserList({ query })).data : [];
      } catch (e) {
        users=[]
      } 
     
    console.log(users)

    return (
        <>
            <Header />
            <div className="flex min-h-screen flex-col p-10">
                <div className="grid grid-cols-1 sm:grid-cols-12">
                    <div className='col-span-5'>
                        <div style={{ "color": "#000000" }}>
                            <h1 className="font-bold text-2xl">Change User Roles</h1>
                            <p style={{ marginBottom: "10px" }}>This page is restricted to users with the super-admin role.</p>
                            <SearchUsers />
                        </div>
                    </div>

                    <div className='col-span-6' style={{ "color": "#000000" }}>

                        {users?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-6" style={{ gap: '0.5rem', paddingTop: "10px" }}>
                                {users.map(user => (
                                    <div key={user.id} className="col-span-6 bg-white p-4 border border-sky-600 rounded-lg shadow" style={{ background: '#ffffff' }}>
                                        <div>
                                            <p className="mb-2 text-md font-bold tracking-tight" style={{ color: '#03adfc' }}>{user.firstName} {user.lastName}</p>
                                            <p className="font-normal text-gray-700 dark:text-gray-400 text-sm" style={{ color: '#03adfc' }}>{
                                                user.emailAddresses.find(
                                                    (email: { id: any; }) => email.id === user.primaryEmailAddressId
                                                )?.emailAddress
                                            }</p>
                                            <div style={{ color: "gray" }}>Role: {user.publicMetadata.role ? (user.publicMetadata.role as string) : ("moderator")}</div>
                                        </div>
                                        <div className='mt-4 pb-1'>
                                            <hr className="my-4 border-gray-200" />
                                        </div>
                                        <div className='grid grid-cols-1 sm:grid-cols-12'>
                                            <div key={user.id} className="col-span-4 pt-1">
                                                <div>
                                                    <form action={setRole}>
                                                        <input type="hidden" value={user.id} name="id" />
                                                        <input type="hidden" value="super_admin" name="role" />
                                                        <button type="submit" className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded" style={{ backgroundColor: "blue", marginLeft: "5px", width: "150px" }}>Super Admin</button>
                                                    </form>
                                                </div>
                                            </div>
                                            <div key={user.id} className="col-span-4 pt-1">
                                                <div>
                                                    <form action={setRole}>
                                                        <input type="hidden" value={user.id} name="id" />
                                                        <input type="hidden" value="admin" name="role" />
                                                        <button type="submit" className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded" style={{ backgroundColor: "blue", marginLeft: "5px", width: "150px" }}>Admin</button>
                                                    </form>
                                                </div>
                                            </div>
                                            <div key={user.id} className="col-span-4 pt-1">
                                                <div>
                                                    <form action={setRole}>
                                                        <input type="hidden" value={user.id} name="id" />
                                                        <input type="hidden" value="moderator" name="role" />
                                                        <button type="submit" className="text-sm bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded" style={{ backgroundColor: "blue", marginLeft: "5px", width: "150px" }}> Moderator</button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <h6 className=' text-sm text-zinc-800 pb-1 hidden'>Sorry.Users Not Found.</h6>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}