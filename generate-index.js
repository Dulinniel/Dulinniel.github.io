// I'm glad I found this script back, It might work and generate my JSON file every time I need it
import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const post_dir = join("public/posts");
const output_file = join("index.json");

const posts = readdirSync(post_dir)
  .filter(file => file.endsWith(".md"))
  .map(file => {
    const content = readFileSync(join(post_dir, file), "utf-8");
    const title_match = content.match(/^#\s(.+)/m);
    return {
      title: title_match ? title_match[1].trim() : file,
      file: `posts/${file}`
    };
  });

writeFileSync(output_file, JSON.stringify(posts, null, 2));
