import { tool } from "@opencode-ai/plugin";
// Example of a custom tool that wraps or restricts bash commands
export default tool({
  description: "Execute safe bash commands",
  args: {
    command: tool.schema.string(),
  },
  async execute(args) {
    if (args.command.includes("rm -rf")) {
      return "Error: Command not allowed";
    }
    // Execute logic here
    return `Executing: ${args.command}`;
  },
});
