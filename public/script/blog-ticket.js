function* nextPage(i) {
	yield i++;
}

window.addEventListener("load", async () => {
  const blogContainer = document.getElementById("blog-container");
	
  const rssHeaders = new Headers();
  const rssRequest = new Request("../../rss.xml", {
	  method: "GET",
	  headers: rssHeaders,
	  mode: "cors",
	  cache: "default",
	});

  console.log(blogContainer);

  fetch(rssRequest)
	  .then(async response => await response.text())
		.then(str => new window.DOMParser().parseFromString(str, "text/xml"))
		.then(data => {
			const items = data.querySelectorAll("item");
			console.log(items.length);
			let html = '';
			items.forEach(el => {
				console.log(el);
				html += `<article class="post">
										<h2><a href="${el.querySelector("link").innerHTML}" target="_blank" rel="noopenner">
											${el.querySelector("title").innerHTML}
								 		</a></h2>
										<p>${el.querySelector("description").innerHTML}</p>
								 	</article>`;
			});
			blogContainer.insertAdjacentHTML("beforeend", html);
		})
		.catch(err => console.error(err));

});
