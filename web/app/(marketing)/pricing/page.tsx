const plans = [
  {
    name: "Starter",
    tagline: "For solo devs, hobby projects, and early pilots.",
    price: "$0.20",
    unit: "/ 1,000 requests",
    priceSubtext: "+ 10,000 free requests/month",
    features: [
      "10k free requests monthly",
      "2 requests/sec sustained",
      "20 requests/sec burst",
      "7-day log retention",
      "Community support",
    ],
  },
  {
    name: "Scale",
    tagline: "For teams moving to production with reliability needs.",
    price: "$149",
    unit: "/ month per org",
    priceSubtext: "+ same $0.20 / 1,000 requests",
    features: [
      "Everything in Starter",
      "10 requests/sec sustained",
      "100 requests/sec burst",
      "30-day log retention",
      "SSO + audit logs",
      "Priority support (8×5)",
    ],
  },
  {
    name: "Enterprise",
    tagline: "For orgs with advanced compliance or scale needs.",
    price: "Custom",
    unit: "",
    priceSubtext: "Annual commit with volume discounts",
    features: [
      "Everything in Scale",
      "Custom rate limits",
      "Custom log retention",
      "SLAs & data residency",
      "Dedicated support (24×7)",
      "DPA & invoicing",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
      <p className="mt-3 max-w-xl text-muted-foreground">
        Simple, transparent pricing. Start free, scale when you are ready.
      </p>

      <div className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead>
            <tr>
              <th className="border border-dashed border-border px-3 py-2 text-left font-bold">
                Plan
              </th>
              <th className="border border-dashed border-border px-3 py-2 text-left font-bold">
                Price
              </th>
              <th className="border border-dashed border-border px-3 py-2 text-left font-bold">
                Includes
              </th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.name}>
                <td className="border border-dashed border-border px-3 py-3 align-top">
                  <p className="font-bold">{plan.name}</p>
                  <p className="mt-1 text-muted-foreground">{plan.tagline}</p>
                </td>
                <td className="border border-dashed border-border px-3 py-3 align-top">
                  <p className="font-bold">
                    {plan.price}
                    {plan.unit && (
                      <span className="font-normal text-muted-foreground">
                        {" "}
                        {plan.unit}
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-muted-foreground">
                    {plan.priceSubtext}
                  </p>
                </td>
                <td className="border border-dashed border-border px-3 py-3 align-top text-muted-foreground">
                  <ul className="list-disc space-y-1 pl-4">
                    {plan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-8 text-sm">
        <a href="/dashboard/signup">Get started</a>
        {" · "}
        <a href="mailto:support@integrate.dev">Contact sales</a>
      </p>
    </div>
  );
}
