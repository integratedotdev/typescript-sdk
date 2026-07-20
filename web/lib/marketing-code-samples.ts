export const authQuickstartCodeSample = `import {
  createMCPServer,
  githubIntegration,
  gmailIntegration,
  slackIntegration,
} from 'integrate-sdk/server';

export const { client: serverClient } = createMCPServer({
  apiKey: process.env.INTEGRATE_API_KEY,
  integrations: [
    githubIntegration({
      scopes: ['repo', 'user'],
    }),
    gmailIntegration({
      scopes: ['https://www.googleapis.com/auth/gmail.send'],
    }),
    slackIntegration({
      scopes: ['chat:write', 'channels:read'],
    }),
  ],
});

await serverClient.github.createIssue({
  owner: 'integrate-dev',
  repo: 'roadmap',
  title: 'Ship agent hand-offs',
});`;
