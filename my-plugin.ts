import { plugin, type PluginBuilder } from "bun";

const myPluginConfig = {
  name: "txt-loader",
  setup(build: PluginBuilder) {
    // Intercepts imports ending with .txt
    build.onLoad({ filter: /\.txt$/ }, async (args: { path: string | URL }) => {
      const text = await Bun.file(args.path).text();
      return {
        contents: `export default ${JSON.stringify(text)};`,
        loader: "js" as const,
      };
    });
  },
};

plugin(myPluginConfig);
