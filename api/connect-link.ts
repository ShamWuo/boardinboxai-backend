// Minimal handler that doesn't require extra Node typings.
// We just declare `process` so TypeScript doesn't complain.
declare var process: any;

import { PipedreamClient } from "@pipedream/sdk";

const client = new PipedreamClient({
  clientId: process.env.PIPEDREAM_CLIENT_ID!,
  clientSecret: process.env.PIPEDREAM_CLIENT_SECRET!,
  projectId: process.env.PIPEDREAM_PROJECT_ID!,
  projectEnvironment: "production",
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

    // Ask Pipedream to create a Connect token for this HOA user
    const { token, connectLinkUrl } = await client.tokens.create({
      externalUserId: userId,
    });

    // Build the link they can click to connect Gmail
    const link =
      connectLinkUrl ||
      `https://pipedream.com/_static/connect.html?token=${token}&app=gmail`;

    res.status(200).json({ link });
  } catch (err: any) {
    console.error("Error creating connect token:", err);
    res
      .status(500)
      .json({ error: err?.message || "Internal server error creating token" });
  }
}
