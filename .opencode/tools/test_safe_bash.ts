import safe from "./safe_bash";

async function main() {
  try {
    const allowed = await safe.execute({ command: "echo hello" });
    console.log("ALLOWED:", allowed);

    const denied = await safe.execute({ command: "rm -rf /tmp/test" });
    console.log("DENIED:", denied);

    process.exit(0);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
}

void main();
