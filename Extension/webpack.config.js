import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default {
  entry: {
    content: "./src/content.tsx",
    background: "./src/background.ts",
    popup: "./src/popup.tsx",
  },
  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: "manifest.json", to: "." }],
    }),
    new HtmlWebpackPlugin({
      template: "src/popup.html",
      filename: "popup.html",
      chunks: ["popup"],
    }),
  ],
};
