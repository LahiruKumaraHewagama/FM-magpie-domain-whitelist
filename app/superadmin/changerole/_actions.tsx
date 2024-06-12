"use server"
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function setRole(formData: FormData) {

    // Update role in Clerk
    try {
      const clerkRes = await clerkClient.users.updateUser(
        formData.get("id") as string,
        {
          publicMetadata: { role: formData.get("role") },
        }
      );
    } catch (error) {
      
    }
    
    redirect("/dashboard")
  
}

export async function initiateRole(id:string, user_role:string) {
  console.log("initating user role")
  // Update role in Clerk
  try {
    await clerkClient.users.updateUser(id,{
      publicMetadata: { role: user_role },
    }
  );
  } catch (error) {
    
  }
 
}
