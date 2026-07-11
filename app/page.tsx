import { logServerButtonClick } from "./actions";

export const dynamic = "force-dynamic";

function maskSecret(value: string | undefined): string {
  if (!value) return "not set";
  if (value.length <= 6) return "******";

  return `${value.slice(0, 4)}...${value.slice(-2)}`;
}

export default function Home() {
  const appMessage = process.env.APP_MESSAGE ?? "not set";
  const secretPreview = maskSecret(process.env.APP_SECRET_HINT);
  const buildTime = process.env.BUILD_TIME ?? "not set";

  return (
    <main>
      <h1>Coolify environment demo</h1>
      <p>These values are read from the server environment on every request.</p>
      <dl>
        <div>
          <dt>Application message</dt>
          <dd>{appMessage}</dd>
        </div>
        <div>
          <dt>Secret hint</dt>
          <dd>{secretPreview}</dd>
        </div>
        <div>
          <dt>Build / deploy time</dt>
          <dd>{buildTime}</dd>
        </div>
      </dl>
      <form action={logServerButtonClick} className="server-log">
        <button type="submit">Escrever log no servidor</button>
      </form>
    </main>
  );
}
