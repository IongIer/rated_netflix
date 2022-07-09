//regex that matches if on correct page

const re = /.+jbv=(?:[\d]+)$/;

//retrive api key from extension storage and append to url
let key = browser.storage.local.get("apikey");
const url = key.then((key) => {
  return "http://www.omdbapi.com/?apikey=" + key["apikey"];
});

//store returned results to avoid repeated requests
let ratings = {};
let previousUrl = "";

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
function getDuration() {
  return document.querySelector(
    ".previewModal--detailsMetadata-info > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(3)"
  ).textContent;
}

function getTitle() {
  return document.querySelector(
    ".about-header > h3:nth-child(1) > strong:nth-child(1)"
  ).textContent;
}

function getYear() {
  return document.querySelector(
    ".previewModal--detailsMetadata-info > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1)"
  ).textContent;
}

function isSeries(duration) {
  return (
    duration.includes("Season") ||
    duration.includes("Episode") ||
    duration.includes("Limited")
  );
}
//observing url change using code adapted from https://stackoverflow.com/questions/37676526/how-to-detect-url-changes-in-spa/67825318#67825318

const observer = new MutationObserver(() => {
  if (location.href !== previousUrl) {
    previousUrl = location.href;
    key.then((result) => {
      if ("apikey" in result) {
        if (re.test(previousUrl)) {
          let duration = getDuration();
          let title = getTitle();
          let year = getYear();
          if (!(title in ratings)) {
            if (isSeries(duration)) {
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
    })
  }
});

const config = { subtree: true, childList: true };
observer.observe(document, config);
