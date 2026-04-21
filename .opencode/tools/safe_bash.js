// Compiled CommonJS copy of safe_bash.ts for testing environment
// DO NOT MODIFY the original safe_bash.ts; this file is a local test shim.
module.exports = {
  default: {
    description: "Execute safe bash commands",
    args: {
      command: "string",
    },
    async execute(args) {
      if (String(args.command).includes("rm -rf")) {
        return "Error: Command not allowed";
      }
      return `Executing: ${args.command}`;
    },
  },
};
