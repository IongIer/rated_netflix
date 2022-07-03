//regex that matches if on correct page

const re = /https:\/\/www\.netflix\.com\/browse\?jbv=([\S]*)$/;
var ratings ={};
async function getRating(name) {
  var apikey = ''
  var url="http://www.omdbapi.com/?apikey="+apikey
  const response = await fetch(url+encodeURIComponent(name))
  const dict = await response.json();
  console.log(dict["Title"], dict["imdbRating"]);
  if (dict["Title"] != undefined ) {
    if (!(dict["Title"] in ratings)) {
      ratings[dict["Title"]]=[dict["imdbRating"], dict["imdbID"]];
    }
    
  } 
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

