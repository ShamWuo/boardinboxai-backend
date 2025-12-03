// api/connect-link.ts
declare var process: any;

import { PipedreamClient } from "@pipedream/sdk";

const client = new PipedreamClient({
  projectEnvironment: "production", // or "development" if that’s what your project uses
  clientId: process.env.PIPEDREAM_CLIENT_ID!,
  clientSecret: process.env.PIPEDREAM_CLIENT_SECRET!,
  projectId: process.env.PIPEDREAM_PROJECT_ID!
});

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "POST only" });
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const userId = body?.userId;

    if (!userId) {
      res.status(400).json({ error: "Missing userId" });
      return;
    }

    // 1) Ask Pipedream for a connect token for this user
    const { connectLinkUrl } = await client.tokens.create({
      externalUserId: userId
    });

    if (!connectLinkUrl) {
      res.status(500).json({ error: "No connectLinkUrl returned from Pipedream" });
      return;
    }

    // 2) Add app=gmail just like the doc’s React demo
    const url = new URL(connectLinkUrl);
    url.searchParams.set("app", "gmail");

    res.status(200).json({ link: url.toString() });
  } catch (err: any) {
    console.error("Error creating connect token:", err);
    res.status(500).json({ error: err?.message || "Internal error creating token" });
  }
}
