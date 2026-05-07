import { plugin } from "bun";

const myPluginConfig = {
  name: "txt-loader",
  setup(build: {
    onLoad: (
      arg0: { filter: RegExp },
      arg1: (args: any) => Promise<{ contents: string; loader: string }>,
    ) => void;
  }) {
    // Intercepts imports ending with .txt
    build.onLoad({ filter: /\.txt$/ }, async (args: { path: string | URL }) => {
      const text = await Bun.file(args.path).text();
      return {
        contents: `export default ${JSON.stringify(text)};`,
        loader: "js",
      };
    });
  },
};

plugin(myPluginConfig);
