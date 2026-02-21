import { Anthropic } from "@anthropic-ai/sdk";
import type { ApiHandlerOptions } from "../../shared/api";
import { ApiStream } from "../transform/stream";
import { BaseProvider } from "./base-provider";
import type { SingleCompletionHandler, ApiHandlerCreateMessageMetadata } from "../index";
export declare class XAIHandler extends BaseProvider implements SingleCompletionHandler {
    protected options: ApiHandlerOptions;
    private client;
    private readonly providerName;
    constructor(options: ApiHandlerOptions);
    getModel(): {
        format: "openai";
        reasoning: import("../transform/reasoning").OpenAiReasoningParams | undefined;
        maxTokens: number | undefined;
        temperature: number | undefined;
        reasoningEffort: import("@roo-code/types").ReasoningEffortExtended | undefined;
        reasoningBudget: number | undefined;
        verbosity: import("@roo-code/types").VerbosityLevel | undefined;
        tools?: boolean;
        id: "grok-code-fast-1" | "grok-4-1-fast-reasoning" | "grok-4-1-fast-non-reasoning" | "grok-4-fast-reasoning" | "grok-4-fast-non-reasoning" | "grok-4-0709" | "grok-3-mini" | "grok-3";
        info: {
            readonly maxTokens: 16384;
            readonly contextWindow: 256000;
            readonly supportsImages: true;
            readonly supportsPromptCache: true;
            readonly inputPrice: 0.2;
            readonly outputPrice: 1.5;
            readonly cacheWritesPrice: 0.02;
            readonly cacheReadsPrice: 0.02;
            readonly description: "xAI's Grok Code Fast model with 256K context window";
            readonly includedTools: ["search_replace"];
            readonly excludedTools: ["apply_diff"];
        } | {
            readonly maxTokens: 65536;
            readonly contextWindow: 2000000;
            readonly supportsImages: true;
            readonly supportsPromptCache: true;
            readonly inputPrice: 0.2;
            readonly outputPrice: 0.5;
            readonly cacheWritesPrice: 0.05;
            readonly cacheReadsPrice: 0.05;
            readonly description: "xAI's Grok 4.1 Fast model with 2M context window, optimized for high-performance agentic tool calling with reasoning";
            readonly includedTools: ["search_replace"];
            readonly excludedTools: ["apply_diff"];
        } | {
            readonly maxTokens: 65536;
            readonly contextWindow: 2000000;
            readonly supportsImages: true;
            readonly supportsPromptCache: true;
            readonly inputPrice: 0.2;
            readonly outputPrice: 0.5;
            readonly cacheWritesPrice: 0.05;
            readonly cacheReadsPrice: 0.05;
            readonly description: "xAI's Grok 4.1 Fast model with 2M context window, optimized for high-performance agentic tool calling";
            readonly includedTools: ["search_replace"];
            readonly excludedTools: ["apply_diff"];
        } | {
            readonly maxTokens: 65536;
            readonly contextWindow: 2000000;
            readonly supportsImages: true;
            readonly supportsPromptCache: true;
            readonly inputPrice: 0.2;
            readonly outputPrice: 0.5;
            readonly cacheWritesPrice: 0.05;
            readonly cacheReadsPrice: 0.05;
            readonly description: "xAI's Grok 4 Fast model with 2M context window, optimized for high-performance agentic tool calling with reasoning";
            readonly includedTools: ["search_replace"];
            readonly excludedTools: ["apply_diff"];
        } | {
            readonly maxTokens: 65536;
            readonly contextWindow: 2000000;
            readonly supportsImages: true;
            readonly supportsPromptCache: true;
            readonly inputPrice: 0.2;
            readonly outputPrice: 0.5;
            readonly cacheWritesPrice: 0.05;
            readonly cacheReadsPrice: 0.05;
            readonly description: "xAI's Grok 4 Fast model with 2M context window, optimized for high-performance agentic tool calling";
            readonly includedTools: ["search_replace"];
            readonly excludedTools: ["apply_diff"];
        } | {
            readonly maxTokens: 8192;
            readonly contextWindow: 256000;
            readonly supportsImages: true;
            readonly supportsPromptCache: true;
            readonly inputPrice: 3;
            readonly outputPrice: 15;
            readonly cacheWritesPrice: 0.75;
            readonly cacheReadsPrice: 0.75;
            readonly description: "xAI's Grok-4 model with 256K context window";
            readonly includedTools: ["search_replace"];
            readonly excludedTools: ["apply_diff"];
        } | {
            readonly maxTokens: 8192;
            readonly contextWindow: 131072;
            readonly supportsImages: true;
            readonly supportsPromptCache: true;
            readonly inputPrice: 0.3;
            readonly outputPrice: 0.5;
            readonly cacheWritesPrice: 0.07;
            readonly cacheReadsPrice: 0.07;
            readonly description: "xAI's Grok-3 mini model with 128K context window";
            readonly supportsReasoningEffort: ["low", "high"];
            readonly reasoningEffort: "low";
            readonly includedTools: ["search_replace"];
            readonly excludedTools: ["apply_diff"];
        } | {
            readonly maxTokens: 8192;
            readonly contextWindow: 131072;
            readonly supportsImages: true;
            readonly supportsPromptCache: true;
            readonly inputPrice: 3;
            readonly outputPrice: 15;
            readonly cacheWritesPrice: 0.75;
            readonly cacheReadsPrice: 0.75;
            readonly description: "xAI's Grok-3 model with 128K context window";
            readonly includedTools: ["search_replace"];
            readonly excludedTools: ["apply_diff"];
        };
    };
    createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[], metadata?: ApiHandlerCreateMessageMetadata): ApiStream;
    completePrompt(prompt: string): Promise<string>;
}
//# sourceMappingURL=xai.d.ts.map