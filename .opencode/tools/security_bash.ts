import type { Plugin } from "@opencode-ai/plugin";

type ToolExecuteBeforeEvent = {
  tool: string;
  sessionID: string;
  callID: string;
  args?: {
    command?: string;
    [key: string]: unknown;
  };
};

export const BashSecurityPlugin: Plugin = async ({}) => {
  return {
    "tool.execute.before": async (event: ToolExecuteBeforeEvent) => {
      // Check if the LLM is trying to use the bash tool
      if (
        event.tool === "bash" &&
        event.args &&
        typeof event.args.command === "string" &&
        event.args.command.includes("rm -rf /")
      ) {
        throw new Error("Dangerous command blocked by plugin.");
      }
    },
  };
};
