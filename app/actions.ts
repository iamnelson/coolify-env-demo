"use server";

export async function logServerButtonClick() {
  console.log("[server-log-button] Botão acionado na app", {
    at: new Date().toISOString(),
  });
}
