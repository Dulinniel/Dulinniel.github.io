import { marked } from "marked";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark.css";

const post_container = document.getElementById("blog-container");
const posts_list = document.getElementById("posts");

fetch("/index.json")
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      const button = document.createElement("button");
      button.textContent = post.title;
      button.addEventListener("click", () => { 
        loadPost(post.file);
      });
      posts_list.appendChild(button);
    });
  });

function loadPost(file)
{
  fetch(`/${file}`)
    .then(res => res.text())
    .then(markdown => {
      post_container.innerHTML = marked.parse(markdown);
      document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
      });
    });
}
