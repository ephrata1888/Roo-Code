import Anthropic from "@anthropic-ai/sdk";
import { FileContextTracker } from "../context-tracking/FileContextTracker";
export interface ProcessUserContentMentionsResult {
    content: Anthropic.Messages.ContentBlockParam[];
    mode?: string;
}
/**
 * Process mentions in user content, specifically within task and feedback tags.
 *
 * File/folder @ mentions are now returned as separate text blocks that
 * look like read_file tool results, making it clear to the model that
 * the file has already been read.
 */
export declare function processUserContentMentions({ userContent, cwd, fileContextTracker, rooIgnoreController, showRooIgnoredFiles, includeDiagnosticMessages, maxDiagnosticMessages, }: {
    userContent: Anthropic.Messages.ContentBlockParam[];
    cwd: string;
    fileContextTracker: FileContextTracker;
    rooIgnoreController?: any;
    showRooIgnoredFiles?: boolean;
    includeDiagnosticMessages?: boolean;
    maxDiagnosticMessages?: number;
}): Promise<ProcessUserContentMentionsResult>;
//# sourceMappingURL=processUserContentMentions.d.ts.map