export interface HookContext {
	activeIntentId?: string
}


export interface Intent {
  id: string
  name: string
  description?: string
  status: "AVAILABLE" | "IN_PROGRESS" | "COMPLETED"
  owned_scope?: string[]
  constraints?: string[]
  acceptance_criteria?: string[]
  permissions?: {
    allow_file_create?: boolean
    allow_file_modify?: boolean
    allow_file_delete?: boolean
    allow_execute_command?: boolean
  }
}

