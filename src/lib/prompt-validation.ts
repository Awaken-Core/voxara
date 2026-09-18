export const normalizePrompt = (text: string) => text.normalize("NFKC").trim();

export const hasUnsupportedControlCharacters = (text: string) =>
    /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/u.test(text);
