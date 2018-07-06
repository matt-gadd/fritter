/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v3.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v3.3.1"});

importScripts(
  "precache-manifest.7d9b695ff9ccabccffe0a803d405a78b.js"
);

workbox.core.setCacheNameDetails({prefix: "fritter"});

workbox.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/https:\/\/fritter-server.now.sh/, workbox.strategies.networkFirst(), 'GET');
workbox.routing.registerRoute(/https:\/\/res.cloudinary.com/, workbox.strategies.cacheFirst(), 'GET');
