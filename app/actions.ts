"use server";

export async function logServerButtonClick() {
  console.log("[server-log-button] Button clicked in the app", {
    at: new Date().toISOString(),
  });
}
