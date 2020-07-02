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

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "78c39ec0ee11d06b933ead7a795f14a0"
  },
  {
    "url": "assets/css/1.styles.cef85f6c.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "assets/css/2.styles.18a4855a.css",
    "revision": "27c433152cbe829319ee7413419f35a3"
  },
  {
    "url": "assets/css/3.styles.36d37a5f.css",
    "revision": "f33e0dc18f09ed7649f28654d316c38b"
  },
  {
    "url": "assets/css/4.styles.2079c03f.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "assets/css/5.styles.b8040ceb.css",
    "revision": "fece63d6d831506a99e942d7df8466bf"
  },
  {
    "url": "assets/css/6.styles.dfb37512.css",
    "revision": "ef04693efda854b0bd0300710bc137b9"
  },
  {
    "url": "assets/css/styles.d8744607.css",
    "revision": "0eb490c78eb3b785ababf779b1541c97"
  },
  {
    "url": "assets/fonts/element-icons.6f0a7632.ttf",
    "revision": "6f0a76321d30f3c8120915e57f7bd77e"
  },
  {
    "url": "assets/img/2.8c3cb683.png",
    "revision": "8c3cb6831a80e597428d05cff372c5a4"
  },
  {
    "url": "assets/img/bottom-logo.385a53c5.png",
    "revision": "385a53c555d8bbd74606d693943ff0c8"
  },
  {
    "url": "assets/img/search.9e8df4f9.svg",
    "revision": "9e8df4f9a86c7d1f229aabc6c7f4f34b"
  },
  {
    "url": "assets/img/shijian.705a04f4.png",
    "revision": "705a04f41b43024fede26f69b95a7293"
  },
  {
    "url": "assets/img/yonghu.423e1b86.png",
    "revision": "423e1b860fa0bdf7199afa574e12130b"
  },
  {
    "url": "assets/js/1.cef85f6c.js",
    "revision": "119e8106c724c0f63131b1d0c15788c2"
  },
  {
    "url": "assets/js/2.18a4855a.js",
    "revision": "da4ce4e725a0b0996f95919d76b5d4f7"
  },
  {
    "url": "assets/js/3.36d37a5f.js",
    "revision": "1072e8fc40bae57f5dafea78cf95c1d0"
  },
  {
    "url": "assets/js/4.2079c03f.js",
    "revision": "aa1f999c98509083d3ddaf6131dfd7b0"
  },
  {
    "url": "assets/js/5.b8040ceb.js",
    "revision": "b5546b6d5b989f54da38714320a777ea"
  },
  {
    "url": "assets/js/6.dfb37512.js",
    "revision": "0f8ce269c9fd9d1c9cd3af048011640d"
  },
  {
    "url": "assets/js/7.99a5497b.js",
    "revision": "f6af5d23e12ba1b94cd064d97dcc3955"
  },
  {
    "url": "assets/js/app.d8744607.js",
    "revision": "6e0b2d233a6cf4b2c8aed47e19e76b88"
  },
  {
    "url": "index.html",
    "revision": "44636bbbf77d8b720d4e9fe14f198a50"
  },
  {
    "url": "left-logo.png",
    "revision": "bbb8db95d83e8472a22907525dc5394e"
  },
  {
    "url": "logo.png",
    "revision": "1987e15f6867ab461bbbca84687a1322"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
