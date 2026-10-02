import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";

// 짧은 질문 쓰기·글 요약이라 Opus와 품질 차이가 거의 없고, 응답이 빠르고(분석 ~3초) 비용이 절반이라 Sonnet 사용
const MODEL = "claude-sonnet-5-5";

let client: Anthropic | null = null;

/** ANTHROPIC_API_KEY가 없으면 빌드가 아니라 실제 호출 시점에 실패하도록 지연 생성 */
function getClient() {
  // 사용자가 화면에서 기다리는 요청이라 오래 매달리지 않게 제한. 429/5xx는 SDK가 1번 더 시도
  client ??= new Anthropic({ timeout: 30_000, maxRetries: 1 });
  return client;
}

/** 모델이 응답을 거절(refusal)한 경우. 호출하는 쪽에서 안내 문구로 대체할 수 있게 구분 */
export class LlmRefusalError extends Error {
  constructor(public category: string | null) {
    super(`LLM refused (${category ?? "unknown"})`);
  }
}

/**
 * Structured Output으로 schema에 맞는 JSON을 받아옴.
 * 응답 실패·스키마 불일치·validate 실패 시 1회 재시도하고, 그래도 실패하면 throw.
 */
export async function generateStructured<T extends z.ZodType>({
  label,
  system,
  prompt,
  schema,
  validate,
}: {
  /** 로그에 남길 작업 이름 (예: "questions", "analysis") */
  label: string;
  system: string;
  prompt: string;
  schema: T;
  /** 스키마로 표현하기 어려운 조건(개수 등) 확인. 문제가 있으면 throw */
  validate?: (output: z.infer<T>) => void;
}): Promise<z.infer<T>> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const startedAt = Date.now();
      const response = await getClient().beta.messages.parse({
        model: MODEL,
        // 측정값: 질문 생성 출력 ~140, 분석 ~270 토큰(thinking 포함). 잘림 방지를 위해 넉넉히 약 7배
        max_tokens: 2000,
        // 짧은 글쓰기 작업이라 깊게 생각할 필요가 적음. Sonnet 5.5는 기본값이 high라 low로 명시
        output_config: { effort: "low", format: betaZodOutputFormat(schema) },
        // 안전 분류기가 거절하면 Anthropic이 권장하는 다른 모델로 서버에서 재시도
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        system,
        messages: [{ role: "user", content: prompt }],
      });

      // 비용·응답 시간 확인용 (output_tokens에는 thinking 토큰도 포함)
      console.info(
        `[llm] ${label} ${Date.now() - startedAt}ms model=${response.model} ` +
          `in=${response.usage.input_tokens} out=${response.usage.output_tokens} stop=${response.stop_reason}`,
      );

      if (response.stop_reason === "refusal") {
        throw new LlmRefusalError(response.stop_details?.category ?? null);
      }
      const output = response.parsed_output;
      if (!output) throw new Error(`structured output missing (stop_reason: ${response.stop_reason})`);
      validate?.(output);
      return output;
    } catch (error) {
      // 거절은 다시 물어도 같은 결과일 가능성이 높아 재시도하지 않음
      if (error instanceof LlmRefusalError) throw error;
      lastError = error;
      console.error(`[llm] ${label} attempt ${attempt} failed`, error);
    }
  }

  throw lastError;
}
