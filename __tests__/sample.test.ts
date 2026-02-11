import { describe, it, expect } from "vitest";

describe("Sample Test", () => {
  it("should pass basic assertion", () => {
    expect(1 + 1).toBe(2);
  });

  it("should work with strings", () => {
    const greeting = "Hello, Data Playground!";
    expect(greeting).toContain("Data Playground");
  });

  it("should work with arrays", () => {
    const formats = ["json", "csv"];
    expect(formats).toHaveLength(2);
    expect(formats).toContain("json");
  });
});
