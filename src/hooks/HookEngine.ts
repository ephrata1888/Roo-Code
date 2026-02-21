import { PostHook } from "./PostHook"
import { PreHook } from "./PreHook"
export class HookEngine {
  constructor(
    private preHook: PreHook,
    private postHook: PostHook
  ) {}

  async interceptToolCall(
    toolName: string,
    args: any,
    execute: () => Promise<any>
  ) {
    await this.preHook.run(toolName)

    const result = await execute()

    await this.postHook.run(toolName, args, result)

    return result
  }
}

