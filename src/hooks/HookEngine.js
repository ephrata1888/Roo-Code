export class HookEngine {
    preHook;
    postHook;
    constructor(preHook, postHook) {
        this.preHook = preHook;
        this.postHook = postHook;
    }
    async interceptToolCall(toolName, args, execute) {
        await this.preHook.run(toolName);
        const result = await execute();
        await this.postHook.run(toolName, args, result);
        return result;
    }
}
