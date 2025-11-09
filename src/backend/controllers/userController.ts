import { supabase } from "../../backend/client/supabaseClient";
import { RegisterFormInputs } from "../models/userModel";

export async function registerUser(data: RegisterFormInputs) {
  try {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { name: data.name, phone: data.phone } },
    });

    if (error) throw error;
    return { success: "Registration successful! Please check your email for verification." };
  } catch (err: unknown) {
    if (err instanceof Error) return { error: err.message };
    return { error: "Something went wrong. Please try again." };
  }
}
