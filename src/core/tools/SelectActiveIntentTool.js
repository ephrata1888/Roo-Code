import fs from "fs";
import yaml from "js-yaml";
import { BaseTool } from "./BaseTool";
export class SelectActiveIntentTool extends BaseTool {
    // Use 'as const' to satisfy @typescript-eslint/prefer-as-const
    name = "custom_tool";
    async execute(params, task, callbacks) {
        const intentFile = ".orchestration/active_intents.yaml";
        const fileContents = fs.readFileSync(intentFile, "utf8");
        const data = yaml.load(fileContents);
        const intent = data.active_intents.find((i) => i.id === params.intent_id);
        if (!intent) {
            throw new Error(`Intent ${params.intent_id} not found`);
        }
        task.result = intent;
    }
}
