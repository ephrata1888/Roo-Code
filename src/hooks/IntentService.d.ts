import { Intent } from "./types";
export declare class IntentService {
    private workspaceRoot;
    private llmClient;
    private activeIntent;
    constructor(workspaceRoot: string, llmClient: {
        complete(prompt: string): Promise<string>;
    });
    loadIntents(): Intent[];
    selectIntent(intentId: string): Intent;
    selectIntentFromCandidates(userCommand: string, candidateIds: string[]): Promise<Intent>;
    getActiveIntent(): Intent | null;
}
//# sourceMappingURL=IntentService.d.ts.map