import { describe, expect, test } from "bun:test";
import { validateRouting } from "@vercel/microfrontends/next/testing";

describe("microfrontends", () => {
  test("routing", () => {
    expect(() => {
      validateRouting("./microfrontends.json", {
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
