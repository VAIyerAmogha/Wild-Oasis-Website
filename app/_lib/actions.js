"use server";

import { redirect } from "next/dist/server/api-utils";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateGuest(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalId = formData.get("nationalId");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalId))
    throw new Error("please provide a valid nation ID");

  const updateData = { nationality, countryFlag, nationalId };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId)
    .select()
    .single();

  if (error) {
    // console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}
