import { PostHook } from "./PostHook";
import { PreHook } from "./PreHook";
export declare class HookEngine {
    private preHook;
    private postHook;
    constructor(preHook: PreHook, postHook: PostHook);
    interceptToolCall(toolName: string, args: any, execute: () => Promise<any>): Promise<any>;
}
//# sourceMappingURL=HookEngine.d.ts.map