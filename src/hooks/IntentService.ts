import * as fs from "fs"
import * as path from "path"
import * as yaml from "js-yaml"
import { Intent } from "./types"

export class IntentService {
  private activeIntent: Intent | null = null

  constructor(
    private workspaceRoot: string,
    private llmClient: {
      complete(prompt: string): Promise<string>
    }
  ) {}

  // -------------------------
  // Load all intents from YAML
  // -------------------------
  loadIntents(): Intent[] {
    const filePath = path.join(
      this.workspaceRoot,
      ".orchestration",
      "active_intents.yaml"
    )

    const file = fs.readFileSync(filePath, "utf8")
    const data = yaml.load(file) as any

    return data.active_intents || []
  }

  // -------------------------
  // Direct selection (manual)
  // -------------------------
  selectIntent(intentId: string): Intent {
    const intents = this.loadIntents()
    const intent = intents.find((i: Intent) => i.id === intentId)

    if (!intent) {
      throw new Error(`Invalid intent ID: ${intentId}`)
    }

    this.activeIntent = intent
    return intent
  }


  async selectIntentFromCandidates(
    userCommand: string,
    candidateIds: string[]
  ): Promise<Intent> {
    const intents = this.loadIntents()

    // Filter to only candidate intents
    const candidateIntents = intents.filter((i) =>
      candidateIds.includes(i.id)
    )

    if (candidateIntents.length === 0) {
      throw new Error("No valid candidate intents provided")
    }

    // Build LLM prompt
    const intentDescriptions = candidateIntents
      .map(
        (i) =>
          `- ${i.id}: ${i.description}`
      )
      .join("\n")

    const prompt = `
You are selecting the correct task intent for Roo Code.

Possible intents:
${intentDescriptions}

User request:
"${userCommand}"

Return ONLY the intent ID.
`.trim()

    const rawResponse = await this.llmClient.complete(prompt)

    const selectedId = rawResponse.trim()

    // 🔒 Validate LLM output
    const validIntent = candidateIntents.find(
      (i) => i.id === selectedId
    )

    if (!validIntent) {
      // Safe fallback — default to ANALYSIS
      const fallback = intents.find((i) => i.id === "INT-ANALYSIS")
      if (!fallback) {
        throw new Error("Fallback intent INT-ANALYSIS not found")
      }

      this.activeIntent = fallback
      return fallback
    }

    this.activeIntent = validIntent
    return validIntent
  }

  // -------------------------
  // Get current active intent
  // -------------------------
  getActiveIntent(): Intent | null {
    return this.activeIntent
  }
}
