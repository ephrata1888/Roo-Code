export class PreHook {
    intentService;
    constructor(intentService) {
        this.intentService = intentService;
    }
    // --- Step 1: Add keyword-based filtering ---
    filterCandidateIntents(userCommand) {
        const candidates = [];
        const cmd = userCommand.toLowerCase();
        if (/\b(fix|bug|error|fail|issue|resolve|patch|correct)\b/.test(cmd)) {
            candidates.push("INT-BUGFIX");
        }
        if (/\b(create|add|implement|new|feature|build|develop|generate|write|insert|setup)\b/.test(cmd)) {
            candidates.push("INT-FEATURE");
        }
        if (/\b(refactor|cleanup|optimize|restructure|improve|reorganize|simplify)\b/.test(cmd)) {
            candidates.push("INT-REFACTOR");
        }
        if (/\b(analyze|inspect|explain|review|understand|read|check|look at|audit|summarize)\b/.test(cmd)) {
            candidates.push("INT-ANALYSIS");
        }
        if (/\b(build|install|setup|config|run|deploy|execute|environment|dependency|command)\b/.test(cmd)) {
            candidates.push("INT-OPS");
        }
        if (candidates.length === 0) {
            candidates.push("INT-ANALYSIS"); // safe fallback
        }
        return candidates;
    }
    // --- Step 2: Update your run() method ---
    async run(userCommand) {
        // 2a. Filter candidate intents based on keywords
        const candidateIntents = this.filterCandidateIntents(userCommand);
        // 2b. Let IntentService pick the best intent from filtered candidates
        const selectedIntent = await this.intentService.selectIntentFromCandidates(userCommand, candidateIntents);
        return selectedIntent;
    }
}
