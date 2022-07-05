//regex that matches if on correct page

const re = /https:\/\/www\.netflix\.com\/browse\?jbv=([\S]*)$/;
const url = browser.storage.local.get("apikey").then((key) => {
  return "http://www.omdbapi.com/?apikey=" + key['apikey'];
});
var ratings = {};
async function getRating(name) {
  const response = await fetch(await url + encodeURIComponent(name));
  const dict = await response.json();
  if (dict["Title"] != undefined) {
    return [dict["imdbRating"], dict["imdbID"]];
  } else {
    return ["N/A", "N/A"];
  }
}

async function insertLink(rating, title) {
  const span = document.createElement("span");
  const target = document.querySelector(".previewModal--detailsMetadata-right");
  const imdb = "https://www.imdb.com/title/" + rating[1];
  const imdbSearch = "https://www.imdb.com/find?q=" + encodeURIComponent(title);
  if (!(rating[1] === "N/A")) {
    span.innerHTML =
      "<a target='_blank' href='" + imdb + "'>IMDB: " + rating[0] + "</a>";
    target.appendChild(span);
  } else {
    span.innerHTML = "<a target='_blank' href='" + imdbSearch + "'>IMDB</a>";
    target.appendChild(span);
  }
}

//observing url change with code from https://stackoverflow.com/questions/37676526/how-to-detect-url-changes-in-spa/67825318#67825318

var previousUrl = "";
var observer = new MutationObserver(function (mutations) {
  if (location.href !== previousUrl) {
    previousUrl = location.href;
    if (re.test(previousUrl)) {
      let title = document.querySelector(
        ".about-header > h3:nth-child(1) > strong:nth-child(1)"
      ).textContent;
      if (!(title in ratings)) {
        getRating(title)
          .then((res) => {
            ratings[title] = res;
          })
          .finally(() => insertLink(ratings[title], title));
      } else {
        insertLink(ratings[title], title);
      }
    }
  }
});

const config = { subtree: true, childList: true };
observer.observe(document, config);
