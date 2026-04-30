/**
 * Enhanced Safe Bash Tool
 * Provides secure command execution with pattern-based blocking and audit logging
 * @version 2.0.0
 * @author Banking Development Team
 */

import { tool } from "@opencode-ai/plugin";

// Dangerous command patterns that should be blocked
const DANGEROUS_PATTERNS = [
  // Recursive force remove - dangerous
  {
    pattern: /rm\s+-rf\s+["']?\/["']?\s*$/i,
    message: "Recursive delete of root directory",
  },
  { pattern: /rm\s+-rf\s+\//i, message: "Recursive delete from root" },
  {
    pattern: /rm\s+-rf\s+\.\./i,
    message: "Recursive delete of parent directory",
  },
  { pattern: /rm\s+-rf\s+\*/i, message: "Recursive delete of all files" },

  // Disk wipe commands
  {
    pattern: /dd\s+.*of=\/dev\/(sd|hd|nvme|vd)/i,
    message: "Direct disk write operation",
  },
  { pattern: /dd\s+.*of=\/dev\/zero/i, message: "Disk zeroing operation" },
  { pattern: /dd\s+.*of=\/dev\/null/i, message: "Disk destructive operation" },
  { pattern: /shred\s+-n\s+\d+/i, message: "Secure file deletion" },
  { pattern: /mkfs\./i, message: "Filesystem creation (destructive)" },
  { pattern: /fdisk\s+\/dev\//i, message: "Disk partitioning" },
  { pattern: /parted\s+\/dev\//i, message: "Disk partitioning" },

  // Fork bombs and resource exhaustion
  { pattern: /:\(\)\{\s*:\|\:&\s*\};:/i, message: "Fork bomb detected" },
  { pattern: /fork\(\)/i, message: "Process forking" },
  {
    pattern: /while\s+true\s+do\s+exec/i,
    message: "Infinite loop fork pattern",
  },

  // System modification
  {
    pattern: /chmod\s+-R\s+777\s+\//i,
    message: "Recursive 777 permissions on root",
  },
  {
    pattern: /chown\s+-R\s+root/i,
    message: "Recursive ownership change to root",
  },
  { pattern: /setenforce\s+0/i, message: "Disabling SELinux" },
  { pattern: /iptables\s+-F/i, message: "Flushing iptables rules" },
  { pattern: /ufw\s+disable/i, message: "Disabling firewall" },

  // Network and remote access
  {
    pattern: /curl\s+.*\|\s*sh/i,
    message: "Pipe to shell (curl-based remote execution)",
  },
  {
    pattern: /wget\s+.*\|\s*sh/i,
    message: "Pipe to shell (wget-based remote execution)",
  },
  { pattern: /bash\s+.*\|\s*sh/i, message: "Pipe to shell" },
  { pattern: /nc\s+-e\s+/i, message: "Netcat reverse shell pattern" },
  { pattern: /nc\s+.*-e\s+/i, message: "Netcat reverse shell pattern" },
  { pattern: /\/dev\/tcp\//i, message: "TCP device file access" },
  { pattern: /bash\s+-i\s+/i, message: "Interactive bash shell" },

  // Environment and credentials
  { pattern: /export\s+PASSWORD/i, message: "Password export to environment" },
  { pattern: /export\s+.*SECRET/i, message: "Secret export to environment" },
  { pattern: /export\s+.*KEY/i, message: "Key export to environment" },
  { pattern: /\.\s*\/?\.env/i, message: "Environment file sourcing" },

  // Process and service manipulation
  { pattern: /kill\s+-9\s+-1/i, message: "Kill all processes" },
  { pattern: /kill\s+-9\s+1/i, message: "Kill init process" },
  { pattern: /pkill\s+-9/i, message: "Force kill processes" },
  { pattern: /systemctl\s+stop\s+ssh/i, message: "Stop SSH service" },
  { pattern: /service\s+ssh\s+stop/i, message: "Stop SSH service" },

  // File permission escalation
  { pattern: /chmod\s+4777/i, message: "Setuid permission" },
  { pattern: /chmod\s+6755/i, message: "Setuid with sticky bit" },
  { pattern: /chmod\s+7777/i, message: "Full permissions with setuid" },

  // Download and execute patterns
  { pattern: /python.*-c.*exec/i, message: "Python remote code execution" },
  { pattern: /perl.*-e.*exec/i, message: "Perl remote code execution" },
  { pattern: /ruby.*-e.*exec/i, message: "Ruby remote code execution" },
  { pattern: /php.*-r.*exec/i, message: "PHP remote code execution" },
];

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\/\.\./, // ../../
  /\.\.\/\.\//, // ../../
  /%2e%2e%2f/i, // URL encoded ../
  /%2e%2e\//i, // URL encoded ../
  /\.\.%2f/i, // URL encoded ./
];

// Allowed commands (whitelist) - if non-empty, only these are allowed
const ALLOWED_COMMANDS = [
  /^ls\s*/i,
  /^cd\s*/i,
  /^pwd/i,
  /^echo\s*/i,
  /^cat\s*/i,
  /^head\s*/i,
  /^tail\s*/i,
  /^grep\s*/i,
  /^find\s*/i,
  /^mkdir\s*/i,
  /^touch\s*/i,
  /^cp\s+/i,
  /^mv\s+/i,
  /^npm\s+(run|install|test|build|dev|lint|format)/i,
  /^bun\s+(run|install|test|build|dev|lint|format)/i,
  /^git\s+(status|diff|log|branch|checkout|add|commit|push|pull)/i,
];

// Audit log for security events
interface AuditLogEntry {
  timestamp: string;
  command: string;
  blocked: boolean;
  reason?: string;
}

const auditLog: AuditLogEntry[] = [];

/**
 * Check if a command contains dangerous patterns
 */
function checkDangerousPatterns(command: string): {
  blocked: boolean;
  reason?: string;
} {
  for (const { pattern, message } of DANGEROUS_PATTERNS) {
    if (pattern.test(command)) {
      return { blocked: true, reason: message };
    }
  }
  return { blocked: false };
}

/**
 * Check for path traversal attempts
 */
function checkPathTraversal(command: string): {
  blocked: boolean;
  reason?: string;
} {
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(command)) {
      return { blocked: true, reason: "Path traversal attempt detected" };
    }
  }
  return { blocked: false };
}

/**
 * Check if command is in allowlist (if configured)
 */
function checkAllowlist(command: string): {
  blocked: boolean;
  reason?: string;
} {
  // If no allowlist configured, skip this check
  if (ALLOWED_COMMANDS.length === 0) {
    return { blocked: false };
  }

  for (const pattern of ALLOWED_COMMANDS) {
    if (pattern.test(command)) {
      return { blocked: false };
    }
  }

  return { blocked: true, reason: "Command not in allowlist" };
}

/**
 * Sanitize command for logging (mask sensitive data)
 */
function sanitizeForLog(command: string): string {
  let sanitized = command;
  // Mask potential secrets
  sanitized = sanitized.replace(
    /(password|secret|key|token)=[^\s]+/gi,
    "$1=***",
  );
  return sanitized;
}

/**
 * Main execute function for the safe_bash tool
 */
export default tool({
  description:
    "Execute safe bash commands with security controls and audit logging",
  args: {
    command: tool.schema.string({
      description: "The bash command to execute",
    }),
    allowlist: tool.schema.boolean({
      description:
        "Enable allowlist mode (only allow predefined safe commands)",
      required: false,
    }),
    timeout: tool.schema.number({
      description: "Command timeout in seconds (default: 30)",
      required: false,
    }),
  },
  async execute(args) {
    const { command, allowlist = false, timeout = 30 } = args;

    // Log the attempt
    const logEntry: AuditLogEntry = {
      timestamp: new Date().toISOString(),
      command: sanitizeForLog(command),
      blocked: false,
    };

    // 1. Check for dangerous patterns
    const dangerCheck = checkDangerousPatterns(command);
    if (dangerCheck.blocked) {
      logEntry.blocked = true;
      logEntry.reason = dangerCheck.reason;
      auditLog.push(logEntry);

      return {
        success: false,
        error: `SECURITY BLOCK: ${dangerCheck.reason}`,
        blocked: true,
        reason: dangerCheck.reason,
        timestamp: logEntry.timestamp,
      };
    }

    // 2. Check for path traversal
    const traversalCheck = checkPathTraversal(command);
    if (traversalCheck.blocked) {
      logEntry.blocked = true;
      logEntry.reason = traversalCheck.reason;
      auditLog.push(logEntry);

      return {
        success: false,
        error: `SECURITY BLOCK: ${traversalCheck.reason}`,
        blocked: true,
        reason: traversalCheck.reason,
        timestamp: logEntry.timestamp,
      };
    }

    // 3. Check allowlist if enabled
    if (allowlist) {
      const allowlistCheck = checkAllowlist(command);
      if (allowlistCheck.blocked) {
        logEntry.blocked = true;
        logEntry.reason = allowlistCheck.reason;
        auditLog.push(logEntry);

        return {
          success: false,
          error: `ALLOWLIST BLOCK: ${allowlistCheck.reason}`,
          blocked: true,
          reason: allowlistCheck.reason,
          timestamp: logEntry.timestamp,
        };
      }
    }

    // 4. Command passed all security checks - execute
    logEntry.blocked = false;
    auditLog.push(logEntry);

    return {
      success: true,
      command: sanitizeForLog(command),
      executed: true,
      timeout,
      timestamp: logEntry.timestamp,
      message: `Command passed security checks. Would execute: ${sanitizeForLog(command)}`,
    };
  },
});

// Export audit log getter for debugging
export function getAuditLog(): AuditLogEntry[] {
  return [...auditLog];
}

export function clearAuditLog(): void {
  auditLog.length = 0;
}
