"use server";

import { createSessionClient, createAdminClient } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { cookies } from "next/headers";
import { parseStringify } from "../utils";


export const signIn = async ({ email, password }: signInProps) => {
  try {
    // Mutation / Database / Make fetch
    const { account } = await createAdminClient();

    const response = await account.createEmailPasswordSession(email, password);
    (await cookies()).set("appwrite-session", response.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(response)
  } catch (error) {
    console.error("Error", error);
  }
};

export const signUp = async ({ password, ...userData }: SignUpParams) => {
  const { email, firstName, lastName } = userData;

  try {
    // Mutation / Database / Make fetch
    const { account } = await createAdminClient();

    const newUserAccount = await account.create(
      ID.unique(),
      email,
      password,
      `${firstName} ${lastName}`,
    );

    if (!newUserAccount) throw new Error("Error creating user");
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify(newUserAccount);
  } catch (error) {
    console.error("Error", error);
  }
};



export const getLoggedInUser = async () => {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();



    return parseStringify(result);
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();
    (await cookies()).delete('appwrite-session')
    await account.deleteSession('current');
  } catch (error) {
    console.log(error);
    return null;
  }
};
