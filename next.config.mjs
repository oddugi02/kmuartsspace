const isGithubActions = process.env.GITHUB_ACTIONS || false;

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "export",
  basePath: isGithubActions ? "/kmuartsspace" : "",
  images: {
    unoptimized: true,
  },
};

export default config;
