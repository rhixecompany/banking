import { plugin } from "bun";

plugin({
  name: "txt-loader",
  setup(build) {
    // Intercepts imports ending with .txt
    build.onLoad({ filter: /\.txt$/ }, async (args) => {
      const text = await Bun.file(args.path).text();
      return {
        contents: `export default ${JSON.stringify(text)};`,
        loader: "js",
      };
    });
  },
});
