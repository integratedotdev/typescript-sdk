"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getServerSession } from "@/lib/data/session";
import type { ActionResult } from "./settings";

export async function deleteAccount(): Promise<ActionResult> {
  const session = await getServerSession();
  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await auth.api.deleteUser({
      body: {},
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    console.error("Account deletion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete account",
    };
  }
}
