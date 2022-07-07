//regex that matches if on correct page

const re = /.+jbv=(?:[\d]+)$/;

//retrive api key from extension storage and append to url
const url = browser.storage.local.get("apikey").then((key) => {
  return "http://www.omdbapi.com/?apikey=" + key["apikey"];
});

//store returned results to avoid repeated requests
var ratings = {};

// due to how netflix stores year for series compared to omdb, year cannot be used for searches
async function getSeriesRating(name) {
  const response = await fetch(
    (await url) + encodeURIComponent(name) + "&type=series"
  );
  const dict = await response.json();
  if (dict["Title"] != undefined) {
    return [dict["imdbRating"], dict["imdbID"]];
  } else {
    return ["N/A", "N/A"];
  }
}

// this gets used in case a certain div on the page shows the duration in minutes instead of episodes
async function getMovieRating(name, year) {
  const response = await fetch(
    (await url) + encodeURIComponent(name) + "&y=" + year
  );
  const dict = await response.json();
  if (dict["Title"] != undefined) {
    return [dict["imdbRating"], dict["imdbID"]];
  } else {
    return ["N/A", "N/A"];
  }
}

// in case of a successful response from the api insert rating and link to imdb else link to imdb search with movie name
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
      let duration = document.querySelector(
        ".previewModal--detailsMetadata-info > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(3)"
      ).textContent;
      let year = document.querySelector(
        ".previewModal--detailsMetadata-info > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
      ).textContent;
      // entry point for functions, if ratings already contains title insert link otherwise call api
      if (!(title in ratings)) {
        if (
          duration.includes("Season") ||
          duration.includes("Episode") ||
          duration.includes("Limited")
        ) {
          getSeriesRating(title)
            .then((result) => {
              ratings[title] = result;
            })
            .finally(() => insertLink(ratings[title], title));
        } else {
          getMovieRating(title, year)
            .then((result) => {
              ratings[title] = result;
            })
            .finally(() => insertLink(ratings[title], title));
        }
      } else {
        insertLink(ratings[title], title);
      }
    }
  }
});

const config = { subtree: true, childList: true };
observer.observe(document, config);


