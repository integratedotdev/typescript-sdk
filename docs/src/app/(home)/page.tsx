import Link from 'next/link';
import { codeToHtml } from 'shiki';
import { ArrowRight } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Footer } from '@/components/footer';
import { FloatingLogos, type LogoItem } from './floating-logos';

const codeSample = `import {
  createMCPServer,
  githubIntegration,
  gmailIntegration,
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
  ],
});

await client.github.createIssue({
  owner: 'integrate-dev',
  repo: 'roadmap',
  title: 'Ship agent hand-offs',
});`;

const vercelAICodeSample = `import { serverClient } from "@/lib/integrate";
import { getVercelAITools } from "integrate-sdk/server";
import { convertToModelMessages, stepCountIs, streamText } from "ai";

export async function POST(req: Request) {
    const { messages } = await req.json();

    const result = streamText({
        model: "openai/gpt-5-mini",
        messages: convertToModelMessages(messages),
        tools: await getVercelAITools(serverClient),
        stopWhen: stepCountIs(5),
    });

    return result.toUIMessageStreamResponse();
}`;

const triggersCodeSample = `import { client } from "integrate-sdk";

// Schedule an email for a specific time
const trigger = await client.trigger.create({
  name: "Follow-up Email",
  toolName: "gmail_send_email",
  toolArguments: {
    to: "friend@example.com",
    subject: "About the dog",
    body: "Hey, just wanted to follow up...",
  },
  schedule: {
    type: "once",
    runAt: new Date("2024-12-13T22:00:00Z"),
  },
});

// Or use cron for recurring triggers
const standup = await client.trigger.create({
  name: "Daily Standup Reminder",
  toolName: "slack_send_message",
  toolArguments: {
    channel: "#engineering",
    text: "Time for standup! 🚀",
  },
  schedule: {
    type: "cron",
    expression: "0 9 * * 1-5", // Weekdays at 9 AM
  },
});`;

type IntegrationResponse = {
  integrations: {
    name: string;
    logo_url: string;
    description: string;
  }[];
};

async function getIntegrationLogos(): Promise<LogoItem[]> {
  try {
    const response = await fetch('https://mcp.integrate.dev/api/v1/integrations', {
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch integrations');
    }

    const data = (await response.json()) as IntegrationResponse;

    return data.integrations.map((integration) => ({
      name: integration.name,
      logoUrl: integration.logo_url,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [lightCodeHtml, darkCodeHtml, lightVercelAICodeHtml, darkVercelAICodeHtml, lightTriggersCodeHtml, darkTriggersCodeHtml, logos] = await Promise.all([
    codeToHtml(codeSample, {
      lang: 'ts',
      theme: 'github-light-default',
    }),
    codeToHtml(codeSample, {
      lang: 'ts',
      theme: 'github-dark',
    }),
    codeToHtml(vercelAICodeSample, {
      lang: 'ts',
      theme: 'github-light-default',
    }),
    codeToHtml(vercelAICodeSample, {
      lang: 'ts',
      theme: 'github-dark',
    }),
    codeToHtml(triggersCodeSample, {
      lang: 'ts',
      theme: 'github-light-default',
    }),
    codeToHtml(triggersCodeSample, {
      lang: 'ts',
      theme: 'github-dark',
    }),
    getIntegrationLogos(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-zinc-950">
      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="py-12 relative min-h-[90vh] overflow-hidden">
          <FloatingLogos logos={logos} />

          <div className="container relative mx-auto flex min-h-[90vh] flex-col items-center justify-center px-6 text-center">
            <h1 className="max-w-lg text-4xl font-semibold leading-tight tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
              Integrate other apps in your app
            </h1>
            <p className="mt-4 max-w-md text-base text-zinc-600 dark:text-zinc-400">
              The fastest gateway to any third party API, get started with less than 20 lines of code.
            </p>
            <div className="mt-8 flex gap-3">
              <Link href="/docs" className="inline-flex h-10 items-center rounded-full border border-zinc-300 bg-zinc-100 px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700">
                View Docs
              </Link>
              <a href="https://app.integrate.dev" className="inline-flex h-10 items-center gap-1 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                Get Started
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </div>

            {/* Code Example */}
            <div className="mt-16 w-full max-w-2xl">
              <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
                <div className="text-sm">
                  <div
                    className="hidden dark:block"
                    dangerouslySetInnerHTML={{ __html: darkCodeHtml }}
                  />
                  <div
                    className="block dark:hidden"
                    dangerouslySetInnerHTML={{ __html: lightCodeHtml }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI SDK Section */}
        <section className="border-t border-zinc-200 bg-zinc-50 py-24 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                No config setup with your AI SDK
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Integrate supports a wide variety of AI SDKs and handles most of the code behind the scenes for you so its only a matter of calling the function in your tools object.
              </p>
              <div className="flex gap-3 pt-2">
                <Link href="/docs" className="inline-flex h-10 items-center rounded-full border border-zinc-300 bg-zinc-100 px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700">
                  View Docs
                </Link>
                <a href="https://app.integrate.dev" className="inline-flex h-10 items-center gap-1 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                  Get Started
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="text-sm">
                <div
                  className="hidden dark:block"
                  dangerouslySetInnerHTML={{ __html: darkVercelAICodeHtml }}
                />
                <div
                  className="block dark:hidden"
                  dangerouslySetInnerHTML={{ __html: lightVercelAICodeHtml }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Triggers Section */}
        <section className="border-t border-zinc-200 bg-white py-24 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="container mx-auto grid gap-12 px-6 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="order-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900 lg:order-1">
              <div className="text-sm">
                <div
                  className="hidden dark:block"
                  dangerouslySetInnerHTML={{ __html: darkTriggersCodeHtml }}
                />
                <div
                  className="block dark:hidden"
                  dangerouslySetInnerHTML={{ __html: lightTriggersCodeHtml }}
                />
              </div>
            </div>
            <div className="order-1 space-y-6 lg:order-2">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
                Schedule actions with Triggers
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">
                Schedule tool executions for a specific time or on a recurring schedule. Perfect for sending scheduled emails, daily reports, automated reminders, and AI agents that schedule actions for later.
              </p>
              <div className="flex gap-3 pt-2">
                <Link href="/docs/getting-started/triggers" className="inline-flex h-10 items-center rounded-full border border-zinc-300 bg-zinc-100 px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700">
                  View Docs
                </Link>
                <a href="https://app.integrate.dev" className="inline-flex h-10 items-center gap-1 rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100">
                  Get Started
                  <ArrowRight className="size-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-zinc-200 bg-zinc-900 py-24 dark:border-zinc-800 dark:bg-black">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Ready to integrate?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-zinc-400">
              Start building with Integrate SDK today. Wire up credentials in minutes and empower your agents.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link href="/docs" className="inline-flex h-10 items-center rounded-full border border-zinc-700 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-800">
                View Docs
              </Link>
              <a href="https://app.integrate.dev" className="inline-flex h-10 items-center gap-1 rounded-full bg-white px-6 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100">
                Get Started
                <ArrowRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
