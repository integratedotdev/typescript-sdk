import { describe, expect, test } from "bun:test";
import { join } from "node:path";
import { validateRouting } from "@vercel/microfrontends/next/testing";

const microfrontendsConfigPath = join(import.meta.dir, "microfrontends.json");

describe("microfrontends", () => {
  test("routing", () => {
    expect(() => {
      validateRouting(microfrontendsConfigPath, {
        "integrate-docs": ["/", "/docs", "/docs/getting-started"],
        "integrate-dashboard": [
          "/dashboard",
          "/dashboard/login",
          "/dashboard/home",
          "/dashboard/api/auth",
          "/dashboard-assets/_next/static/chunks/main.js",
          "/vc-ap-13c0d8/_next/static/chunks/main.js",
        ],
      });
    }).not.toThrow();
  });
});
