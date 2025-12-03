import { PipedreamClient } from "@pipedream/sdk";
import type { VercelRequest, VercelResponse } from '@vercel/node';

const client = new PipedreamClient({
  clientId: process.env.PIPEDREAM_CLIENT_ID!,
  clientSecret: process.env.PIPEDREAM_CLIENT_SECRET!,
  projectId: process.env.PIPEDREAM_PROJECT_ID!,
  projectEnvironment: "production"
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    // Create a connect token for this specific HOA user
    const { token, connectLinkUrl } = await client.tokens.create({
      externalUserId: userId
    });

    // Build the URL they click
    const link =
      connectLinkUrl ||
      `https://pipedream.com/_static/connect.html?token=${token}&app=gmail`;

    return res.status(200).json({ link });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
