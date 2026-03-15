import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test("studio completes a live topic-to-audio run with language switching", async ({ page }) => {
  test.setTimeout(240_000);

  await page.goto("/studio");
  await expect(page.getByTestId("voice-loading")).toContainText("Voice options loaded", {
    timeout: 45_000,
  });
  await expect(page.getByTestId("voice-select-a")).not.toHaveValue("", {
    timeout: 45_000,
  });
  await expect(page.getByTestId("voice-select-b")).not.toHaveValue("", {
    timeout: 45_000,
  });

  await page.getByTestId("source-input").fill("How voice agents help product teams onboard faster");
  await page
    .getByTestId("intent-input")
    .fill("Explain it in German with practical examples for product and support teams.");
  await page.getByTestId("language-select").selectOption("de");
  await page.getByTestId("generate-button").click();

  await expect(page.getByTestId("audio-player")).toBeVisible({ timeout: 240_000 });
  await expect(page.getByTestId("episode-title")).not.toContainText("Nothing generated yet");
  await expect(page.getByTestId("direct-answer")).not.toContainText(
    "The grounded answer will appear here after generation.",
  );
  expect(await page.getByTestId("checklist").locator("li").count()).toBeGreaterThan(2);
  await expect(page.getByTestId("episode-title")).toBeVisible();
});

test("api route completes a live German URL-to-audio run with citations and follow-up reuse", async ({
  request,
}) => {
  test.setTimeout(420_000);

  const voicesResponse = await request.get("/api/voices");
  expect(voicesResponse.ok()).toBeTruthy();
  const voicesPayload = (await voicesResponse.json()) as {
    voices?: Array<{ id: string }>;
  };
  const firstVoice = voicesPayload.voices?.[0]?.id;
  const secondVoice = voicesPayload.voices?.[1]?.id;

  expect(firstVoice).toBeTruthy();
  expect(secondVoice).toBeTruthy();

  const response = await request.post("/api/generate", {
    data: {
      input: "https://service.berlin.de/",
      userIntent:
        "I need driving licence related information in Berlin, especially requirements, documents, fees, and appointments.",
      language: "de",
      voiceIdHostA: firstVoice,
      voiceIdHostB: secondVoice,
    },
  });

  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as {
    sourceType?: string;
    userIntent?: string | null;
    language?: string;
    retrievalContext?: string;
    contextLength?: number;
    relevantSources?: Array<{ url?: string; label?: string }>;
    audio?: { base64?: string };
    episode?: {
      dialogue?: unknown[];
      checklist?: string[];
      citations?: unknown[];
      directAnswer?: string;
    };
  };

  expect(payload.sourceType).toBe("url");
  expect(payload.userIntent).toContain("driving licence");
  expect(payload.language).toBe("de");
  expect((payload.contextLength ?? 0) > 200).toBeTruthy();
  expect((payload.relevantSources?.length ?? 0) > 0).toBeTruthy();
  expect(payload.relevantSources?.some((source) => source.url?.includes("service.berlin.de"))).toBeTruthy();
  expect((payload.retrievalContext?.length ?? 0) > 500).toBeTruthy();
  expect((payload.episode?.directAnswer?.length ?? 0) > 20).toBeTruthy();
  expect((payload.episode?.checklist?.length ?? 0) >= 3).toBeTruthy();
  expect((payload.episode?.citations?.length ?? 0) >= 2).toBeTruthy();
  expect((payload.episode?.dialogue?.length ?? 0) >= 4).toBeTruthy();
  expect((payload.audio?.base64?.length ?? 0) > 1000).toBeTruthy();

  const followUpResponse = await request.post("/api/generate", {
    data: {
      input: "https://service.berlin.de/",
      userIntent: "Welche Unterlagen brauche ich und wo buche ich einen Termin?",
      language: "de",
      retrievalContext: payload.retrievalContext,
      relevantSources: payload.relevantSources,
      voiceIdHostA: firstVoice,
      voiceIdHostB: secondVoice,
    },
  });

  expect(followUpResponse.ok()).toBeTruthy();
  const followUpPayload = (await followUpResponse.json()) as {
    userIntent?: string | null;
    language?: string;
    relevantSources?: Array<{ url?: string }>;
    episode?: {
      citations?: unknown[];
      directAnswer?: string;
    };
    audio?: { base64?: string };
  };

  expect(followUpPayload.userIntent).toContain("Unterlagen");
  expect(followUpPayload.language).toBe("de");
  expect((followUpPayload.relevantSources?.length ?? 0) === (payload.relevantSources?.length ?? 0)).toBeTruthy();
  expect((followUpPayload.episode?.citations?.length ?? 0) >= 2).toBeTruthy();
  expect((followUpPayload.episode?.directAnswer?.length ?? 0) > 20).toBeTruthy();
  expect((followUpPayload.audio?.base64?.length ?? 0) > 1000).toBeTruthy();
});
