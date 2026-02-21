import { Anthropic } from "@anthropic-ai/sdk";
import type { ApiHandlerOptions } from "../../shared/api";
import { ApiStream } from "../transform/stream";
import { BaseProvider } from "./base-provider";
import type { SingleCompletionHandler, ApiHandlerCreateMessageMetadata } from "../index";
export declare class MiniMaxHandler extends BaseProvider implements SingleCompletionHandler {
    private options;
    private client;
    constructor(options: ApiHandlerOptions);
    createMessage(systemPrompt: string, messages: Anthropic.Messages.MessageParam[], metadata?: ApiHandlerCreateMessageMetadata): ApiStream;
    /**
     * Add cache control to the last two user messages for prompt caching
     */
    private addCacheControl;
    getModel(): {
        format: "anthropic";
        reasoning: import("../transform/reasoning").AnthropicReasoningParams | undefined;
        maxTokens: number | undefined;
        temperature: number | undefined;
        reasoningEffort: import("@roo-code/types").ReasoningEffortExtended | undefined;
        reasoningBudget: number | undefined;
        verbosity: import("@roo-code/types").VerbosityLevel | undefined;
        tools?: boolean;
        id: "MiniMax-M2" | "MiniMax-M2-Stable" | "MiniMax-M2.1";
        info: {
            readonly maxTokens: 16384;
            readonly contextWindow: 192000;
            readonly supportsImages: false;
            readonly supportsPromptCache: true;
            readonly includedTools: ["search_and_replace"];
            readonly excludedTools: ["apply_diff"];
            readonly preserveReasoning: true;
            readonly inputPrice: 0.3;
            readonly outputPrice: 1.2;
            readonly cacheWritesPrice: 0.375;
            readonly cacheReadsPrice: 0.03;
            readonly description: "MiniMax M2, a model born for Agents and code, featuring Top-tier Coding Capabilities, Powerful Agentic Performance, and Ultimate Cost-Effectiveness & Speed.";
        } | {
            readonly maxTokens: 16384;
            readonly contextWindow: 192000;
            readonly supportsImages: false;
            readonly supportsPromptCache: true;
            readonly includedTools: ["search_and_replace"];
            readonly excludedTools: ["apply_diff"];
            readonly preserveReasoning: true;
            readonly inputPrice: 0.3;
            readonly outputPrice: 1.2;
            readonly cacheWritesPrice: 0.375;
            readonly cacheReadsPrice: 0.03;
            readonly description: "MiniMax M2 Stable (High Concurrency, Commercial Use), a model born for Agents and code, featuring Top-tier Coding Capabilities, Powerful Agentic Performance, and Ultimate Cost-Effectiveness & Speed.";
        } | {
            readonly maxTokens: 16384;
            readonly contextWindow: 192000;
            readonly supportsImages: false;
            readonly supportsPromptCache: true;
            readonly includedTools: ["search_and_replace"];
            readonly excludedTools: ["apply_diff"];
            readonly preserveReasoning: true;
            readonly inputPrice: 0.3;
            readonly outputPrice: 1.2;
            readonly cacheWritesPrice: 0.375;
            readonly cacheReadsPrice: 0.03;
            readonly description: "MiniMax M2.1 builds on M2 with improved overall performance for agentic coding tasks and significantly faster response times.";
        };
    };
    completePrompt(prompt: string): Promise<string>;
}
//# sourceMappingURL=minimax.d.ts.map