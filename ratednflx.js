//regex that matches if on correct page

const re = /https:\/\/www\.netflix\.com\/browse\?jbv=([\S]*)$/;
var ratings = new Map();
var apikey = ''
function getRating(name) {
  var url="http://www.omdbapi.com/?apikey=" + apikey
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    dict = JSON.parse(this.responseText);
    console.log(dict["Title"], dict["imdbRating"]);
    if (dict["Title"] != undefined ) {
      ratings.set([dict["Title"]], [dict["imdbRating"], dict["imdbID"]])
    } 
  }
  xhr.open("GET", url+encodeURIComponent(name), true);
  xhr.send();
}

//observing url change with code from https://stackoverflow.com/questions/37676526/how-to-detect-url-changes-in-spa/67825318#67825318

var previousUrl = '';
var observer = new MutationObserver(function(mutations) {
  if (location.href !== previousUrl) {
      previousUrl = location.href;
      if (re.test(previousUrl)) {
        title = document.querySelector(".about-header > h3:nth-child(1) > strong:nth-child(1)").textContent
        getRating(title);
        console.log(ratings);
      }
      
    }
});

const config = {subtree: true, childList: true};
observer.observe(document, config);

