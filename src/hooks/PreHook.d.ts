import { IntentService } from "./IntentService";
export declare class PreHook {
    private intentService;
    constructor(intentService: IntentService);
    filterCandidateIntents(userCommand: string): string[];
    run(userCommand: string): Promise<import("./types").Intent>;
}
//# sourceMappingURL=PreHook.d.ts.map