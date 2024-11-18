function organizePosts(postsArray)
{
  let html = ''.concat(...postsArray);
/*  postsArray.forEach(element => 
  {
    console.log(element);
    html.concat(...`<article class="post">
    <h2><a href="${element.querySelector("link").innerHTML}" target="_blank" rel="noopenner">
    ${element.querySelector("title").innerHTML}
    </a></h2>
    <p>${element.querySelector('description').innerHTML}</p>
    <p class="date">${element.querySelector("pubDate").innerHTML}</p>
    </article>`);
  });*/

  console.log(html);
  return html;
}

const blogContainer = document.getElementById("blog-container");

const rssHeaders = new Headers();
const rssRequest = new Request("../../rss.xml", {
  method: "GET",
  headers: rssHeaders,
  mode: "cors",
  cache: "default",
});

fetch(rssRequest)
  .then(async response => await response.text())
  .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
  .then(data => {
    const items = data.querySelectorAll("item");

    if ( items.length <= 9 )
    {
      let articles = organizePosts(items);
      blogContainer.insertAdjacentHTML("beforeend", articles);
    }
    else
    {
      let toArray = Array.from(items)
      let reducedArray = toArray.slice(0, 9);
      let articles = organizePosts(reducedArray);
      articles += `<span>
                    <button id="previous" class="navigation">Previous</button>
                    <button id="next" class="navigation">Next</button>
                  </span>`;
      blogContainer.insertAdjacentHTML("beforeend", articles);
    }
  })
  .catch(err => console.error(err));
