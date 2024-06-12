"use client";

import { usePathname, useRouter } from "next/navigation";

export const SearchUsers = () => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div style={{ "color": "#000000" }}>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    const queryTerm = formData.get("search") as string;
                    router.push(pathname + "?search=" + queryTerm);
                }}
            >
                <label htmlFor="search" style={{marginTop:"5px"}}>Search Users by email</label>
                <div>
                <input id="search" name="search" type="text" style={{"border": "1px solid #000000"}} />
                <button type="submit" className="text-sm bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-4 rounded" style={{ backgroundColor: "blue", marginLeft:"5px" }}>
                    Search
                </button>
                </div>
                
            </form>
        </div>
    );
};