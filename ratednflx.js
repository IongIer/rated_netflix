//regex that matches if on correct page

const re = /https:\/\/www\.netflix\.com\/browse\?jbv=([\S]*)$/;
const apikey = "";
const url = "http://www.omdbapi.com/?apikey=" + apikey;

var ratings = {};
async function getRating(name) {
  const response = await fetch(url + encodeURIComponent(name));
  const dict = await response.json();
  console.log(dict["Title"], dict["imdbRating"]);
  if (dict["Title"] != undefined) {
    ratings[dict["Title"]] = [dict["imdbRating"], dict["imdbID"]];
  }
}

//observing url change with code from https://stackoverflow.com/questions/37676526/how-to-detect-url-changes-in-spa/67825318#67825318

var previousUrl = "";
var observer = new MutationObserver(function (mutations) {
  if (location.href !== previousUrl) {
    previousUrl = location.href;
    if (re.test(previousUrl)) {
      title = document.querySelector(
        ".about-header > h3:nth-child(1) > strong:nth-child(1)"
      ).textContent;
      if (!(title in ratings)) {
        getRating(title);
        console.log(ratings);
      }
    }
  }
});

const config = { subtree: true, childList: true };
observer.observe(document, config);
