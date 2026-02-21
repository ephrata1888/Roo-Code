import EventEmitter from "events";
import { Anthropic } from "@anthropic-ai/sdk";
import * as vscode from "vscode";
import { type TaskProviderLike, type TaskProviderEvents, type ProviderSettings, type RooCodeSettings, type ProviderSettingsEntry, type StaticAppProperties, type GitProperties, type TelemetryProperties, type TelemetryPropertiesProvider, type CodeActionId, type CodeActionName, type TerminalActionId, type TerminalActionPromptType, type HistoryItem, type CreateTaskOptions, type ExtensionMessage, type ExtensionState } from "@roo-code/types";
import { type AggregatedCosts } from "./aggregateTaskCosts";
import { Mode } from "../../shared/modes";
import WorkspaceTracker from "../../integrations/workspace/WorkspaceTracker";
import { McpHub } from "../../services/mcp/McpHub";
import { CodeIndexManager } from "../../services/code-index/manager";
import { MdmService } from "../../services/mdm/MdmService";
import { SkillsManager } from "../../services/skills/SkillsManager";
import { ContextProxy } from "../config/ContextProxy";
import { ProviderSettingsManager } from "../config/ProviderSettingsManager";
import { CustomModesManager } from "../config/CustomModesManager";
import { Task } from "../task/Task";
import type { TodoItem } from "@roo-code/types";
/**
 * https://github.com/microsoft/vscode-webview-ui-toolkit-samples/blob/main/default/weather-webview/src/providers/WeatherViewProvider.ts
 * https://github.com/KumarVariable/vscode-extension-sidebar-html/blob/master/src/customSidebarViewProvider.ts
 */
export type ClineProviderEvents = {
    clineCreated: [cline: Task];
};
export declare class ClineProvider extends EventEmitter<TaskProviderEvents> implements vscode.WebviewViewProvider, TelemetryPropertiesProvider, TaskProviderLike {
    readonly context: vscode.ExtensionContext;
    private readonly outputChannel;
    private readonly renderContext;
    readonly contextProxy: ContextProxy;
    static readonly sideBarId: string;
    static readonly tabPanelId: string;
    private static activeInstances;
    private disposables;
    private webviewDisposables;
    private view?;
    private clineStack;
    private codeIndexStatusSubscription?;
    private codeIndexManager?;
    private _workspaceTracker?;
    protected mcpHub?: McpHub;
    protected skillsManager?: SkillsManager;
    private marketplaceManager;
    private mdmService?;
    private taskCreationCallback;
    private taskEventListeners;
    private currentWorkspacePath;
    private _disposed;
    private recentTasksCache?;
    private taskHistoryWriteLock;
    private pendingOperations;
    private static readonly PENDING_OPERATION_TIMEOUT_MS;
    private cloudOrganizationsCache;
    private cloudOrganizationsCacheTimestamp;
    private static readonly CLOUD_ORGANIZATIONS_CACHE_DURATION_MS;
    /**
     * Monotonically increasing sequence number for clineMessages state pushes.
     * Used by the frontend to reject stale state that arrives out-of-order.
     */
    private clineMessagesSeq;
    isViewLaunched: boolean;
    settingsImportedAt?: number;
    readonly latestAnnouncementId = "jan-2026-v3.45.0-smart-code-folding";
    readonly providerSettingsManager: ProviderSettingsManager;
    readonly customModesManager: CustomModesManager;
    constructor(context: vscode.ExtensionContext, outputChannel: vscode.OutputChannel, renderContext: "sidebar" | "editor" | undefined, contextProxy: ContextProxy, mdmService?: MdmService);
    /**
     * Override EventEmitter's on method to match TaskProviderLike interface
     */
    on<K extends keyof TaskProviderEvents>(event: K, listener: (...args: TaskProviderEvents[K]) => void | Promise<void>): this;
    /**
     * Override EventEmitter's off method to match TaskProviderLike interface
     */
    off<K extends keyof TaskProviderEvents>(event: K, listener: (...args: TaskProviderEvents[K]) => void | Promise<void>): this;
    /**
     * Initialize cloud profile synchronization
     */
    private initializeCloudProfileSync;
    /**
     * Handle cloud settings updates
     */
    private handleCloudSettingsUpdate;
    /**
     * Synchronize cloud profiles with local profiles.
     */
    private syncCloudProfiles;
    /**
     * Initialize cloud profile synchronization when CloudService is ready
     * This method is called externally after CloudService has been initialized
     */
    initializeCloudProfileSyncWhenReady(): Promise<void>;
    addClineToStack(task: Task): Promise<void>;
    performPreparationTasks(cline: Task): Promise<void>;
    removeClineFromStack(options?: {
        skipDelegationRepair?: boolean;
    }): Promise<void>;
    getTaskStackSize(): number;
    getCurrentTaskStack(): string[];
    /**
     * Sets a pending edit operation with automatic timeout cleanup
     */
    setPendingEditOperation(operationId: string, editData: {
        messageTs: number;
        editedContent: string;
        images?: string[];
        messageIndex: number;
        apiConversationHistoryIndex: number;
    }): void;
    /**
     * Gets a pending edit operation by ID
     */
    private getPendingEditOperation;
    /**
     * Clears a specific pending edit operation
     */
    private clearPendingEditOperation;
    /**
     * Clears all pending edit operations
     */
    private clearAllPendingEditOperations;
    private clearWebviewResources;
    dispose(): Promise<void>;
    static getVisibleInstance(): ClineProvider | undefined;
    static getInstance(): Promise<ClineProvider | undefined>;
    static isActiveTask(): Promise<boolean>;
    static handleCodeAction(command: CodeActionId, promptType: CodeActionName, params: Record<string, string | any[]>): Promise<void>;
    static handleTerminalAction(command: TerminalActionId, promptType: TerminalActionPromptType, params: Record<string, string | any[]>): Promise<void>;
    resolveWebviewView(webviewView: vscode.WebviewView | vscode.WebviewPanel): Promise<void>;
    createTaskWithHistoryItem(historyItem: HistoryItem & {
        rootTask?: Task;
        parentTask?: Task;
    }, options?: {
        startTask?: boolean;
    }): Promise<Task>;
    postMessageToWebview(message: ExtensionMessage): Promise<void>;
    private getHMRHtmlContent;
    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where references to the React webview build files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
    private getHtmlContent;
    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is received.
     *
     * @param webview A reference to the extension webview
     */
    private setWebviewMessageListener;
    /**
     * Handle switching to a new mode, including updating the associated API configuration
     * @param newMode The mode to switch to
     */
    handleModeSwitch(newMode: Mode): Promise<void>;
    /**
     * Updates the current task's API handler.
     * Rebuilds when:
     * - provider or model changes, OR
     * - explicitly forced (e.g., user-initiated profile switch/save to apply changed settings like headers/baseUrl/tier).
     * Always synchronizes task.apiConfiguration with latest provider settings.
     * @param providerSettings The new provider settings to apply
     * @param options.forceRebuild Force rebuilding the API handler regardless of provider/model equality
     */
    private updateTaskApiHandlerIfNeeded;
    getProviderProfileEntries(): ProviderSettingsEntry[];
    getProviderProfileEntry(name: string): ProviderSettingsEntry | undefined;
    hasProviderProfileEntry(name: string): boolean;
    upsertProviderProfile(name: string, providerSettings: ProviderSettings, activate?: boolean): Promise<string | undefined>;
    deleteProviderProfile(profileToDelete: ProviderSettingsEntry): Promise<void>;
    private persistStickyProviderProfileToCurrentTask;
    activateProviderProfile(args: {
        name: string;
    } | {
        id: string;
    }, options?: {
        persistModeConfig?: boolean;
        persistTaskHistory?: boolean;
    }): Promise<void>;
    updateCustomInstructions(instructions?: string): Promise<void>;
    ensureMcpServersDirectoryExists(): Promise<string>;
    ensureSettingsDirectoryExists(): Promise<string>;
    handleOpenRouterCallback(code: string): Promise<void>;
    handleRequestyCallback(code: string, baseUrl: string | null): Promise<void>;
    getTaskWithId(id: string): Promise<{
        historyItem: HistoryItem;
        taskDirPath: string;
        apiConversationHistoryFilePath: string;
        uiMessagesFilePath: string;
        apiConversationHistory: Anthropic.MessageParam[];
    }>;
    getTaskWithAggregatedCosts(taskId: string): Promise<{
        historyItem: HistoryItem;
        aggregatedCosts: AggregatedCosts;
    }>;
    showTaskWithId(id: string): Promise<void>;
    exportTaskWithId(id: string): Promise<void>;
    condenseTaskContext(taskId: string): Promise<void>;
    deleteTaskWithId(id: string, cascadeSubtasks?: boolean): Promise<void>;
    deleteTaskFromState(id: string): Promise<void>;
    refreshWorkspace(): Promise<void>;
    postStateToWebview(): Promise<void>;
    /**
     * Like postStateToWebview but intentionally omits taskHistory.
     *
     * Rationale:
     * - taskHistory can be large and was being resent on every chat message update.
     * - The webview maintains taskHistory in-memory and receives updates via
     *   `taskHistoryUpdated` / `taskHistoryItemUpdated`.
     */
    postStateToWebviewWithoutTaskHistory(): Promise<void>;
    /**
     * Like postStateToWebview but intentionally omits both clineMessages and taskHistory.
     *
     * Rationale:
     * - Cloud event handlers (auth, settings, user-info) and mode changes trigger state pushes
     *   that have nothing to do with chat messages. Including clineMessages in these pushes
     *   creates race conditions where a stale snapshot of clineMessages (captured during async
     *   getStateToPostToWebview) overwrites newer messages the task has streamed in the meantime.
     * - This method ensures cloud/mode events only push the state fields they actually affect
     *   (cloud auth, org settings, profiles, etc.) without interfering with task message streaming.
     */
    postStateToWebviewWithoutClineMessages(): Promise<void>;
    /**
     * Fetches marketplace data on demand to avoid blocking main state updates
     */
    fetchMarketplaceData(): Promise<void>;
    /**
     * Merges allowed commands from global state and workspace configuration
     * with proper validation and deduplication
     */
    private mergeAllowedCommands;
    /**
     * Merges denied commands from global state and workspace configuration
     * with proper validation and deduplication
     */
    private mergeDeniedCommands;
    /**
     * Common utility for merging command lists from global state and workspace configuration.
     * Implements the Command Denylist feature's merging strategy with proper validation.
     *
     * @param configKey - VSCode workspace configuration key
     * @param commandType - Type of commands for error logging
     * @param globalStateCommands - Commands from global state
     * @returns Merged and deduplicated command list
     */
    private mergeCommandLists;
    getStateToPostToWebview(): Promise<ExtensionState>;
    /**
     * Storage
     * https://dev.to/kompotkot/how-to-use-secretstorage-in-your-vscode-extensions-2hco
     * https://www.eliostruyf.com/devhack-code-extension-storage-options/
     */
    getState(): Promise<Omit<ExtensionState, "clineMessages" | "renderContext" | "hasOpenedModeSelector" | "version" | "shouldShowAnnouncement">>;
    /**
     * Serializes all read-modify-write operations on taskHistory to prevent
     * concurrent interleaving that can cause entries to vanish.
     */
    private withTaskHistoryLock;
    /**
     * Updates a task in the task history and optionally broadcasts the updated history to the webview.
     * @param item The history item to update or add
     * @param options.broadcast Whether to broadcast the updated history to the webview (default: true)
     * @returns The updated task history array
     */
    updateTaskHistory(item: HistoryItem, options?: {
        broadcast?: boolean;
    }): Promise<HistoryItem[]>;
    /**
     * Broadcasts a task history update to the webview.
     * This sends a lightweight message with just the task history, rather than the full state.
     * @param history The task history to broadcast (if not provided, reads from global state)
     */
    broadcastTaskHistoryUpdate(history?: HistoryItem[]): Promise<void>;
    private updateGlobalState;
    private getGlobalState;
    setValue<K extends keyof RooCodeSettings>(key: K, value: RooCodeSettings[K]): Promise<void>;
    getValue<K extends keyof RooCodeSettings>(key: K): RooCodeSettings[K];
    getValues(): RooCodeSettings;
    setValues(values: RooCodeSettings): Promise<void>;
    resetState(): Promise<void>;
    log(message: string): void;
    get workspaceTracker(): WorkspaceTracker | undefined;
    get viewLaunched(): boolean;
    get messages(): {
        type: "ask" | "say";
        ts: number;
        text?: string | undefined;
        reasoning?: string | undefined;
        ask?: "followup" | "command" | "command_output" | "completion_result" | "tool" | "api_req_failed" | "resume_task" | "resume_completed_task" | "mistake_limit_reached" | "use_mcp_server" | "auto_approval_max_req_reached" | undefined;
        say?: "command_output" | "completion_result" | "tool" | "error" | "api_req_started" | "api_req_finished" | "api_req_retried" | "api_req_retry_delayed" | "api_req_rate_limit_wait" | "api_req_deleted" | "text" | "image" | "reasoning" | "user_feedback" | "user_feedback_diff" | "shell_integration_warning" | "mcp_server_request_started" | "mcp_server_response" | "subtask_result" | "checkpoint_saved" | "rooignore_error" | "diff_error" | "condense_context" | "condense_context_error" | "sliding_window_truncation" | "codebase_search_result" | "user_edit_todos" | "too_many_tools_warning" | undefined;
        images?: string[] | undefined;
        partial?: boolean | undefined;
        conversationHistoryIndex?: number | undefined;
        checkpoint?: Record<string, unknown> | undefined;
        progressStatus?: {
            text?: string | undefined;
            icon?: string | undefined;
        } | undefined;
        contextCondense?: {
            cost: number;
            prevContextTokens: number;
            newContextTokens: number;
            summary: string;
            condenseId?: string | undefined;
        } | undefined;
        contextTruncation?: {
            prevContextTokens: number;
            newContextTokens: number;
            truncationId: string;
            messagesRemoved: number;
        } | undefined;
        isProtected?: boolean | undefined;
        apiProtocol?: "openai" | "anthropic" | undefined;
        isAnswered?: boolean | undefined;
    }[];
    getMcpHub(): McpHub | undefined;
    getSkillsManager(): SkillsManager | undefined;
    /**
     * Check if the current state is compliant with MDM policy
     * @returns true if compliant or no MDM policy exists, false if MDM policy exists and user is non-compliant
     */
    checkMdmCompliance(): boolean;
    remoteControlEnabled(enabled: boolean): Promise<void>;
    /**
     * Gets the CodeIndexManager for the current active workspace
     * @returns CodeIndexManager instance for the current workspace or the default one
     */
    getCurrentWorkspaceCodeIndexManager(): CodeIndexManager | undefined;
    /**
     * Updates the code index status subscription to listen to the current workspace manager
     */
    private updateCodeIndexStatusSubscription;
    /**
     * TaskProviderLike, TelemetryPropertiesProvider
     */
    getCurrentTask(): Task | undefined;
    getRecentTasks(): string[];
    createTask(text?: string, images?: string[], parentTask?: Task, options?: CreateTaskOptions, configuration?: RooCodeSettings): Promise<Task>;
    cancelTask(): Promise<void>;
    clearTask(): Promise<void>;
    resumeTask(taskId: string): void;
    getModes(): Promise<{
        slug: string;
        name: string;
    }[]>;
    getMode(): Promise<string>;
    setMode(mode: string): Promise<void>;
    getProviderProfiles(): Promise<{
        name: string;
        provider?: string;
    }[]>;
    getProviderProfile(): Promise<string>;
    setProviderProfile(name: string): Promise<void>;
    private _appProperties?;
    private _gitProperties?;
    private getAppProperties;
    get appProperties(): StaticAppProperties;
    private getCloudProperties;
    private getTaskProperties;
    private getGitProperties;
    get gitProperties(): GitProperties | undefined;
    getTelemetryProperties(): Promise<TelemetryProperties>;
    get cwd(): string;
    /**
     * Delegate parent task and open child task.
     *
     * - Enforce single-open invariant
     * - Persist parent delegation metadata
     * - Emit TaskDelegated (task-level; API forwards to provider/bridge)
     * - Create child as sole active and switch mode to child's mode
     */
    delegateParentAndOpenChild(params: {
        parentTaskId: string;
        message: string;
        initialTodos: TodoItem[];
        mode: string;
    }): Promise<Task>;
    /**
     * Reopen parent task from delegation with write-back and events.
     */
    reopenParentFromDelegation(params: {
        parentTaskId: string;
        childTaskId: string;
        completionResultSummary: string;
    }): Promise<void>;
    /**
     * Convert a file path to a webview-accessible URI
     * This method safely converts file paths to URIs that can be loaded in the webview
     *
     * @param filePath - The absolute file path to convert
     * @returns The webview URI string, or the original file URI if conversion fails
     * @throws {Error} When webview is not available
     * @throws {TypeError} When file path is invalid
     */
    convertToWebviewUri(filePath: string): string;
}
//# sourceMappingURL=ClineProvider.d.ts.map