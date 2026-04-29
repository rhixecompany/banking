/**
 * Enhanced Bash Security Plugin
 * Provides runtime security monitoring for bash tool executions
 * Blocks dangerous commands at the plugin level before execution
 * @version 2.0.0
 * @author Banking Development Team
 */

import type { Plugin } from "@opencode-ai/plugin";

/**
 * Event fired before a tool is executed
 */
type ToolExecuteBeforeEvent = {
  tool: string;
  sessionID: string;
  callID: string;
  args?: {
    command?: string;
    [key: string]: unknown;
  };
};

/**
 * Event fired after a tool executes
 */
type ToolExecuteAfterEvent = {
  tool: string;
  sessionID: string;
  callID: string;
  args?: {
    command?: string;
    [key: string]: unknown;
  };
  result?: unknown;
  error?: Error;
};

/**
 * Security configuration options
 */
interface SecurityConfig {
  /** Enable detailed logging */
  verbose?: boolean;
  /** Block commands that attempt path traversal */
  blockPathTraversal?: boolean;
  /** Block network-related commands */
  blockNetworkCommands?: boolean;
  /** Custom blocked patterns (regex strings) */
  customPatterns?: string[];
  /** Whitelisted commands that are always allowed */
  whitelist?: string[];
}

// Default security configuration
const DEFAULT_CONFIG: SecurityConfig = {
  verbose: false,
  blockPathTraversal: true,
  blockNetworkCommands: true,
  customPatterns: [],
  whitelist: [],
};

/**
 * Comprehensive list of dangerous command patterns
 */
const DANGEROUS_PATTERNS: Array<{ pattern: RegExp; message: string; category: string }> = [
  // File destruction - Category: DESTRUCTIVE
  { pattern: /rm\s+-rf\s+["']?\/["']?\s*$/i, message: "Recursive delete of root directory", category: "DESTRUCTIVE" },
  { pattern: /rm\s+-rf\s+\//i, message: "Recursive delete from root", category: "DESTRUCTIVE" },
  { pattern: /rm\s+-rf\s+\.\./i, message: "Recursive delete of parent directory", category: "DESTRUCTIVE" },
  { pattern: /rm\s+-rf\s+\*/i, message: "Recursive delete of all files", category: "DESTRUCTIVE" },
  { pattern: /rm\s+-r\s+["']?\.\*["']?/i, message: "Recursive delete of hidden files", category: "DESTRUCTIVE" },
  
  // Disk operations - Category: DISK
  { pattern: /dd\s+.*of=\/dev\/(sd|hd|nvme|vd)/i, message: "Direct disk write operation", category: "DISK" },
  { pattern: /dd\s+.*of=\/dev\/zero/i, message: "Disk zeroing operation", category: "DISK" },
  { pattern: /dd\s+.*of=\/dev\/null/i, message: "Disk destructive operation", category: "DISK" },
  { pattern: /shred\s+-n\s+\d+/i, message: "Secure file deletion", category: "DISK" },
  { pattern: /mkfs\./i, message: "Filesystem creation (destructive)", category: "DISK" },
  { pattern: /fdisk\s+\/dev\//i, message: "Disk partitioning", category: "DISK" },
  { pattern: /parted\s+\/dev\//i, message: "Disk partitioning", category: "DISK" },
  { pattern: /pvcreate\s+/i, message: "Physical volume creation", category: "DISK" },
  { pattern: /vgcreate\s+/i, message: "Volume group creation", category: "DISK" },
  
  // Resource exhaustion - Category: RESOURCE
  { pattern: /:\(\)\{\s*:\|\:&\s*\};:/i, message: "Fork bomb detected", category: "RESOURCE" },
  { pattern: /\&\s*;\s*:\s*\|/i, message: "Fork bomb pattern", category: "RESOURCE" },
  { pattern: /while\s+true\s+do\s+exec/i, message: "Infinite loop fork pattern", category: "RESOURCE" },
  { pattern: /xargs\s+-n\s+\d+\s+-P\s+\d+/i, message: "Parallel command execution (potential resource exhaustion)", category: "RESOURCE" },
  
  // System modification - Category: SYSTEM
  { pattern: /chmod\s+-R\s+777\s+\//i, message: "Recursive 777 permissions on root", category: "SYSTEM" },
  { pattern: /chown\s+-R\s+root/i, message: "Recursive ownership change to root", category: "SYSTEM" },
  { pattern: /setenforce\s+0/i, message: "Disabling SELinux", category: "SYSTEM" },
  { pattern: /setenforce\s+Permissive/i, message: "Setting SELinux to permissive", category: "SYSTEM" },
  { pattern: /iptables\s+-F/i, message: "Flushing iptables rules", category: "SYSTEM" },
  { pattern: /iptables\s+-X/i, message: "Deleting iptables chains", category: "SYSTEM" },
  { pattern: /iptables\s+-Z/i, message: "Zeroing iptables counters", category: "SYSTEM" },
  { pattern: /ufw\s+disable/i, message: "Disabling firewall", category: "SYSTEM" },
  { pattern: /systemctl\s+stop\s+.*daemon/i, message: "Stopping system daemon", category: "SYSTEM" },
  { pattern: /init\s+0/i, message: "System halt", category: "SYSTEM" },
  { pattern: /init\s+6/i, message: "System reboot", category: "SYSTEM" },
  { pattern: /shutdown\s+-h\s+now/i, message: "System halt", category: "SYSTEM" },
  { pattern: /reboot/i, message: "System reboot", category: "SYSTEM" },
  
  // Network and remote access - Category: NETWORK
  { pattern: /curl\s+.*\|\s*sh/i, message: "Pipe to shell (curl-based remote execution)", category: "NETWORK" },
  { pattern: /wget\s+.*\|\s*sh/i, message: "Pipe to shell (wget-based remote execution)", category: "NETWORK" },
  { pattern: /bash\s+.*\|\s*sh/i, message: "Pipe to shell", category: "NETWORK" },
  { pattern: /nc\s+-e\s+/i, message: "Netcat reverse shell pattern", category: "NETWORK" },
  { pattern: /nc\s+.*-e\s+/i, message: "Netcat reverse shell pattern", category: "NETWORK" },
  { pattern: /ncat\s+-e\s+/i, message: "Ncat reverse shell pattern", category: "NETWORK" },
  { pattern: /\/dev\/tcp\//i, message: "TCP device file access", category: "NETWORK" },
  { pattern: /bash\s+-i\s+/i, message: "Interactive bash shell", category: "NETWORK" },
  { pattern: /python.*-c.*exec/i, message: "Python remote code execution", category: "NETWORK" },
  { pattern: /php.*-r.*exec/i, message: "PHP remote code execution", category: "NETWORK" },
  { pattern: /socat\s+/i, message: "Socat network tool", category: "NETWORK" },
  { pattern: /socat\s+-exec/i, message: "Socat exec pattern", category: "NETWORK" },
  
  // Environment and credentials - Category: CREDENTIALS
  { pattern: /export\s+PASSWORD/i, message: "Password export to environment", category: "CREDENTIALS" },
  { pattern: /export\s+.*SECRET/i, message: "Secret export to environment", category: "CREDENTIALS" },
  { pattern: /export\s+.*KEY/i, message: "Key export to environment", category: "CREDENTIALS" },
  { pattern: /export\s+.*TOKEN/i, message: "Token export to environment", category: "CREDENTIALS" },
  { pattern: /\.\s*\/?\.env/i, message: "Environment file sourcing", category: "CREDENTIALS" },
  { pattern: /source\s+\.env/i, message: "Environment file sourcing", category: "CREDENTIALS" },
  { pattern: /echo\s+.*password.*>>/i, message: "Writing password to file", category: "CREDENTIALS" },
  
  // Process manipulation - Category: PROCESS
  { pattern: /kill\s+-9\s+-1/i, message: "Kill all processes", category: "PROCESS" },
  { pattern: /kill\s+-9\s+1/i, message: "Kill init process", category: "PROCESS" },
  { pattern: /pkill\s+-9/i, message: "Force kill processes", category: "PROCESS" },
  { pattern: /killall\s+-9/i, message: "Force kill all processes", category: "PROCESS" },
  { pattern: /systemctl\s+kill/i, message: "Systemctl kill", category: "PROCESS" },
  
  // Privilege escalation - Category: PRIVILEGE
  { pattern: /chmod\s+4777/i, message: "Setuid permission", category: "PRIVILEGE" },
  { pattern: /chmod\s+6755/i, message: "Setuid with sticky bit", category: "PRIVILEGE" },
  { pattern: /chmod\s+7777/i, message: "Full permissions with setuid", category: "PRIVILEGE" },
  { pattern: /chmod\s+u\+s/i, message: "Setuid bit", category: "PRIVILEGE" },
  { pattern: /sudo\s+-s/i, message: "Sudo to shell", category: "PRIVILEGE" },
  { pattern: /sudo\s+-i/i, message: "Sudo interactive shell", category: "PRIVILEGE" },
  { pattern: /su\s+-\s+/i, message: "Switch user", category: "PRIVILEGE" },
  
  // Download and execute - Category: DOWNLOAD
  { pattern: /curl\s+-o\s+/i, message: "Download file with curl", category: "DOWNLOAD" },
  { pattern: /wget\s+-O\s+/i, message: "Download file with wget", category: "DOWNLOAD" },
  { pattern: /fetch\s+-o\s+/i, message: "Download file with fetch", category: "DOWNLOAD" },
  { pattern: /apt-get\s+install\s+-y\s+.*nc/i, message: "Install netcat", category: "DOWNLOAD" },
  { pattern: /yum\s+install\s+-y\s+.*nc/i, message: "Install netcat", category: "DOWNLOAD" },
  
  // Path traversal - Category: TRAVERSAL
  { pattern: /\.\.\/\.\./i, message: "Path traversal: multiple parent directories", category: "TRAVERSAL" },
  { pattern: /\.\.\/,\./i, message: "Path traversal: parent and current", category: "TRAVERSAL" },
  { pattern: /%2e%2e%2f/i, message: "Path traversal: URL encoded", category: "TRAVERSAL" },
  { pattern: /%2e%2e\//i, message: "Path traversal: URL encoded", category: "TRAVERSAL" },
];

/**
 * Security plugin instance
 */
export const BashSecurityPlugin: Plugin = async (config?: SecurityConfig) => {
  const cfg = { ...DEFAULT_CONFIG, ...config };
  
  // Build combined pattern list
  const allPatterns = [...DANGEROUS_PATTERNS];
  
  // Add custom patterns
  if (cfg.customPatterns && cfg.customPatterns.length > 0) {
    for (const pattern of cfg.customPatterns) {
      allPatterns.push({
        pattern: new RegExp(pattern, "i"),
        message: "Custom blocked pattern",
        category: "CUSTOM",
      });
    }
  }

  // Audit log for security events
  const securityLog: Array<{
    timestamp: string;
    event: string;
    tool: string;
    command?: string;
    blocked: boolean;
    reason?: string;
    category?: string;
  }> = [];

  /**
   * Check command against all dangerous patterns
   */
  function checkCommand(command: string): { blocked: boolean; reason?: string; category?: string } {
    for (const { pattern, message, category } of allPatterns) {
      if (pattern.test(command)) {
        return { blocked: true, reason: message, category };
      }
    }
    return { blocked: false };
  }

  /**
   * Check if command is whitelisted
   */
  function isWhitelisted(command: string): boolean {
    if (!cfg.whitelist || cfg.whitelist.length === 0) {
      return false;
    }
    for (const allowed of cfg.whitelist) {
      if (new RegExp(allowed, "i").test(command)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Log security event
   */
  function logSecurityEvent(
    eventType: string,
    tool: string,
    command: string | undefined,
    blocked: boolean,
    reason?: string,
    category?: string
  ): void {
    const entry = {
      timestamp: new Date().toISOString(),
      event: eventType,
      tool,
      command: command ? maskSensitive(command) : undefined,
      blocked,
      reason,
      category,
    };
    securityLog.push(entry);
    
    if (cfg.verbose) {
      console.log(`[SECURITY] ${entry.timestamp} - ${eventType}: ${tool}`, {
        command: entry.command,
        blocked,
        reason,
        category,
      });
    }
  }

  /**
   * Mask sensitive data in command
   */
  function maskSensitive(cmd: string): string {
    return cmd
      .replace(/(password|secret|key|token)=[^\s&]*/gi, "$1=***")
      .replace(/['"][^'"]*password[^'"]*['"]/gi, "***");
  }

  return {
    /**
     * Hook executed BEFORE a tool is called
     */
    "tool.execute.before": async (event: ToolExecuteBeforeEvent) => {
      // Only process bash tool
      if (event.tool !== "bash" && event.tool !== "shell") {
        return;
      }

      const command = event.args?.command;
      
      if (!command || typeof command !== "string") {
        return;
      }

      // Check whitelist first
      if (isWhitelisted(command)) {
        logSecurityEvent("WHITELISTED", event.tool, command, false, undefined, "WHITELIST");
        return;
      }

      // Check for dangerous patterns
      const checkResult = checkCommand(command);
      
      if (checkResult.blocked) {
        logSecurityEvent(
          "BLOCKED",
          event.tool,
          command,
          true,
          checkResult.reason,
          checkResult.category
        );
        
        throw new Error(
          `SECURITY BLOCK: Command blocked by security plugin.\n` +
          `Reason: ${checkResult.reason}\n` +
          `Category: ${checkResult.category}\n` +
          `If this is a false positive, please contact the security team.`
        );
      }

      logSecurityEvent(
        "ALLOWED",
        event.tool,
        command,
        false,
        undefined,
        "SAFE"
      );
    },

    /**
     * Hook executed AFTER a tool completes
     */
    "tool.execute.after": async (event: ToolExecuteAfterEvent) => {
      if (event.tool !== "bash" && event.tool !== "shell") {
        return;
      }

      if (cfg.verbose) {
        const command = event.args?.command;
        logSecurityEvent(
          "COMPLETED",
          event.tool,
          command,
          false,
          event.error?.message,
          event.error ? "ERROR" : "SUCCESS"
        );
      }
    },
  };
};

/**
 * Export security log for debugging
 */
export function getSecurityLog(): typeof securityLog {
  return securityLog;
}

// Track security log at module level
const securityLog: Array<{
  timestamp: string;
  event: string;
  tool: string;
  command?: string;
  blocked: boolean;
  reason?: string;
  category?: string;
}> = [];

// Export the plugin as default
export default BashSecurityPlugin;