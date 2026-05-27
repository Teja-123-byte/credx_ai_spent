import test from "node:test";
import assert from "node:assert/strict";

import { calcToolCost, runAudit } from "../src/lib/auditEngine.js";

function buildInput(overrides = {}) {
  return {
    companyName: "Acme AI",
    teamSize: 1,
    primaryUseCase: "engineering",
    tools: [],
    ...overrides,
  };
}

test("calcToolCost returns catalog pricing and delta for known tools", () => {
  const result = calcToolCost({
    tool: "cursor",
    plan: "Pro",
    seats: 3,
    monthlySpend: 90,
  });

  assert.equal(result.displayName, "Cursor");
  assert.equal(result.catalogMonthly, 60);
  assert.equal(result.delta, 30);
});

test("runAudit includes downgrade and annual billing savings in totals", () => {
  const report = runAudit(
    buildInput({
      teamSize: 2,
      tools: [
        {
          tool: "cursor",
          plan: "Teams",
          seats: 2,
          monthlySpend: 100,
        },
      ],
    })
  );

  assert.equal(report.totalMonthlySpend, 100);
  assert.equal(report.totalCatalogMonthly, 80);
  assert.equal(report.totalPotentialMonthlySavings, 60);
  assert.equal(report.totalPotentialAnnualSavings, 720);
  assert.equal(report.savingsPercentage, 60);
  assert.deepEqual(
    report.recommendations.map((recommendation) => recommendation.type),
    ["downgrade_plan", "annual_billing"]
  );
  assert.equal(report.recommendations[0].monthlySavings, 40);
  assert.equal(report.recommendations[1].monthlySavings, 20);
  assert.match(report.generatedAt, /^\d{4}-\d{2}-\d{2}T/);
});

test("runAudit flags excess seats using the catalog seat price", () => {
  const report = runAudit(
    buildInput({
      teamSize: 3,
      tools: [
        {
          tool: "copilot",
          plan: "Enterprise",
          seats: 5,
          monthlySpend: 195,
        },
      ],
    })
  );

  const excessSeats = report.recommendations.find(
    (recommendation) => recommendation.type === "excess_seats"
  );

  assert.ok(excessSeats);
  assert.equal(excessSeats.monthlySavings, 78);
  assert.equal(excessSeats.annualSavings, 936);
  assert.equal(report.totalPotentialMonthlySavings, 178);
});

test("runAudit detects overlapping coding tools", () => {
  const report = runAudit(
    buildInput({
      tools: [
        {
          tool: "copilot",
          plan: "Free",
          seats: 1,
          monthlySpend: 10,
        },
        {
          tool: "windsurf",
          plan: "Free",
          seats: 1,
          monthlySpend: 15,
        },
      ],
    })
  );

  assert.equal(report.recommendations.length, 1);
  assert.equal(report.recommendations[0].type, "tool_overlap");
  assert.equal(report.recommendations[0].monthlySavings, 15);
  assert.match(report.recommendations[0].message, /GitHub Copilot, Windsurf/);
});

test("runAudit detects overlapping general AI assistants", () => {
  const report = runAudit(
    buildInput({
      tools: [
        {
          tool: "claude",
          plan: "Free",
          seats: 1,
          monthlySpend: 20,
        },
        {
          tool: "chatgpt",
          plan: "Free",
          seats: 1,
          monthlySpend: 25,
        },
      ],
    })
  );

  assert.equal(report.recommendations.length, 1);
  assert.equal(report.recommendations[0].type, "tool_overlap");
  assert.equal(report.recommendations[0].monthlySavings, 25);
  assert.match(
    report.recommendations[0].message,
    /Claude \(Anthropic\), ChatGPT \(OpenAI\)/
  );
});

test("runAudit falls back gracefully when pricing data is missing", () => {
  const report = runAudit(
    buildInput({
      teamSize: 4,
      tools: [
        {
          tool: "unknown-tool",
          plan: "Starter",
          seats: 4,
          monthlySpend: 99,
        },
      ],
    })
  );

  assert.equal(report.totalCatalogMonthly, 99);
  assert.equal(report.totalPotentialMonthlySavings, 0);
  assert.equal(report.recommendations.length, 0);
  assert.equal(report.breakdown[0].catalogMonthly, null);
  assert.equal(report.breakdown[0].delta, null);
});

test("runAudit returns a zero savings percentage when spend is zero", () => {
  const report = runAudit(
    buildInput({
      tools: [
        {
          tool: "copilot",
          plan: "Free",
          seats: 1,
          monthlySpend: 0,
        },
      ],
    })
  );

  assert.equal(report.totalMonthlySpend, 0);
  assert.equal(report.totalPotentialMonthlySavings, 0);
  assert.equal(report.totalPotentialAnnualSavings, 0);
  assert.equal(report.savingsPercentage, 0);
  assert.equal(report.recommendations.length, 0);
});
