// Learn more: https://docs.expo.dev/guides/customizing-metro/
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// The Next.js admin app lives in admin/ inside this repo. Its .next build
// output churns transient files that crash Metro's file watcher (ENOENT on a
// deleted _not-found chunk). Exclude the whole admin/ tree from Metro — the
// mobile app never imports from it.
config.resolver.blockList = [/[\\/]admin[\\/].*/];

module.exports = config;
