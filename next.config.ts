import type { NextConfig } from "next";

// Static export: `next build` writes plain HTML/CSS/JS to out/, which is what
// GitHub Pages serves. No server, so no API routes, no middleware, no image
// optimization endpoint (hence images.unoptimized).
//
// BASE_PATH mirrors the pattern used by the sibling lab site (infosci.github.io)
// for consistency, even though this site has no preview/subpath deployment of
// its own today — it is always empty in practice, served at the root of
// sci.yonsei.ac.kr.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // GitHub Pages serves /people/ as /people/index.html; without this, exported
  // routes land as /people.html and every directory-style link 404s.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
