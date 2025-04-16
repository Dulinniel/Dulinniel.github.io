import { marked } from "marked";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark.css";

const post_container = document.getElementById("blog-container");
const posts_list = document.getElementById("posts");

fetch("/index.json")
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      const fragment = document.createDocumentFragment();
      const button = document.createElement("button");
      button.textContent = "Lire";
      button.name = "open";
      button.addEventListener("click", () => { 
        loadPost(post.file);
      });

      const post_card = fragment
        .appendChild(Object.assign( 
          document.createElement("section"), { className: "post" } )
        )
        .appendChild(Object.assign(
          document.createElement("h2"), { className: "post-title", textContent: post.title } )
        );
      post_card.insertAdjacentElement("afterend", button);
      posts_list.appendChild(fragment);
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

