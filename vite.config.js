import { viteStaticCopy } from 'vite-plugin-static-copy';
import { resolve } from "path";

export default
{
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        blog: resolve("pages/blog.html")
      }
    }
  },
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'index.json', dest: '.' },
        { src: 'robots.txt', dest: '.' },
        { src: 'sitemap.xml', dest: '.' },
        { src: 'browserconfig.xml', dest: '.' },
        { src: 'human.txt', dest: '.' },
        { src: 'site.webmanifest', dest: '.' },

        { src: 'src', dest: '.' },
        { src: 'errors', dest: '.' }
      ]
    })
  ]

}
