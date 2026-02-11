import { describe, it, expect } from "vitest";
import { detectFormat, parseJSON, parseCSV } from "@/lib/utils/parser";

describe("detectFormat", () => {
  it("should detect JSON format", () => {
    const input = JSON.stringify([{ id: 1, name: "Alice" }]);
    expect(detectFormat(input)).toBe("json");
  });

  it("should detect CSV format", () => {
    const input = "id,name\n1,Alice\n2,Bob";
    expect(detectFormat(input)).toBe("csv");
  });

  it("should return null for empty input", () => {
    expect(detectFormat("")).toBe(null);
    expect(detectFormat("   ")).toBe(null);
  });
});

describe("parseJSON", () => {
  it("should parse valid JSON array", () => {
    const input = JSON.stringify([
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
    ]);
    const result = parseJSON(input);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.columns).toEqual(["id", "name"]);
  });

  it("should wrap single JSON object in array", () => {
    const input = JSON.stringify({ id: 1, name: "Alice" });
    const result = parseJSON(input);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.columns).toEqual(["id", "name"]);
  });

  it("should extract array from { data: [...] } pattern", () => {
    const input = JSON.stringify({
      data: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    });
    const result = parseJSON(input);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.columns).toEqual(["id", "name"]);
  });

  it("should extract array from { results: [...] } pattern", () => {
    const input = JSON.stringify({
      results: [{ id: 1, name: "Alice" }],
    });
    const result = parseJSON(input);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(1);
    expect(result.columns).toEqual(["id", "name"]);
  });

  it("should detect JSON object format", () => {
    const input = JSON.stringify({ data: [{ id: 1 }] });
    expect(detectFormat(input)).toBe("json");
  });

  it("should fail for invalid JSON", () => {
    const input = "{ invalid json }";
    const result = parseJSON(input);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe("parseCSV", () => {
  it("should parse valid CSV", () => {
    const input = "id,name,age\n1,Alice,28\n2,Bob,35";
    const result = parseCSV(input);

    expect(result.success).toBe(true);
    expect(result.data).toHaveLength(2);
    expect(result.columns).toEqual(["id", "name", "age"]);
  });

  it("should handle empty CSV", () => {
    const input = "";
    const result = parseCSV(input);

    expect(result.success).toBe(false);
  });

  it("should parse CSV with dynamic typing", () => {
    const input = "id,name,age\n1,Alice,28\n2,Bob,35";
    const result = parseCSV(input);

    expect(result.success).toBe(true);
    if (result.data) {
      expect(result.data[0].id).toBe(1); // number, not string
      expect(result.data[0].age).toBe(28); // number, not string
    }
  });
});
