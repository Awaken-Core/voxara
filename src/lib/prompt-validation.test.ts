import { describe, expect, test } from "vitest";

import {
    hasUnsupportedControlCharacters,
    normalizePrompt,
} from "@/lib/prompt-validation";

describe("prompt normalization", () => {
    test("applies NFKC normalization and trims surrounding whitespace", () => {
        expect(normalizePrompt("  Ｈｅｌｌｏ １２３  ")).toBe("Hello 123");
    });

    test("preserves Hindi text", () => {
        expect(normalizePrompt("  नमस्ते दुनिया  ")).toBe("नमस्ते दुनिया");
    });

    test("detects unsupported control characters", () => {
        expect(hasUnsupportedControlCharacters("hello\u0000world")).toBe(true);
    });

    test("allows tabs and line breaks", () => {
        expect(hasUnsupportedControlCharacters("first line\nsecond\tline")).toBe(false);
    });
});
