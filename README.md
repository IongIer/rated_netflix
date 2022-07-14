# Rated Netflix

## CS50x 2022 final project

#### Video Demo: [DEMO](https://www.youtube.com/watch?v=x-OiXIfwVVY)

#### How to use:
1.[Mozilla extension page](https://addons.mozilla.org/en-US/firefox/addon/rated-netflix/)
2. Get an api key from the link in the extension popup
3. Update key to extension storage
4. When navigating Netflix, ratings and links to IMDB will be inserted in the movie details page DOM

#### Description:

Simple firefox extension that uses OMDB api to look up Netflix movies/shows and inserts IMDB links and ratings on the Netflix movie details page.

I chose this as a final project for two main reasons: 

It solves a problem I had with watching stuff on Netflix, as the info provided was never enough to decide if something is worth watching I always manually looked up the show/movie.
During the course there was very little content for the javascript part so this felt like a good challenge, writing something useful in an unfamiliar language.


#### Design history:

Due to my inexperience with javascript and it's lovely way to fail without an error message in the console it was a somewhat frustrating but rewarding experience. Learning about promises and async/await was especially interesting as nothing like this was covered in CS50x for js or C/Python.

My initial version was using the older and more complicated XMLHttpRequest fortunately half way through I found out about fetch while asking for help on Discord and was very glad to make the switch. This is what I get for writing in js with just the knowledge from the lecture and the help of Google.

When thinking about making the extension I assumed there was an IMDB api to use even if not documented or that I'd crawl IMDB directly but ultimately decided against it and went with OMDB.
Crawling IMDB was a more complex and resource intensive approach that probably was against IMDB terms of service as well. 
The other option was TMDB but OMDB keys were easier to get, requiering no account creation and since I decided that to use the extension you had to input your own key instead of storing it as a secret inside the extension(this would have been enough for a while as free keys have 1000calls/day). Requiering users to get their own key is quite a big minus in terms of user friendliness however it has it's advantages and it allowed me to learn about extension storage among other things.

Who knows maybe I won't be the only user and this way it can scale as long as OMDB gives away free keys.

#### Current problems:

Data is messy and Netflix has some quirks to how it stores information that prevents results from being 100% accurate, there are some false results although quite rare. Right now it seems there is 90%+ accuracy as long as the profile language is set to english.

For example some movies on Netflix will have the localised name and OMDB has a different name for the same movie, while looking up the movie with it's Netflix name OMDB returns N/A, in such cases the extension inserts a link to the search page on IMDB as that is smarter about finding movies compared to OMDB which expects exact matches.

Another difference is how years are stored across platforms, for series Netflix displays the year of the latest season but OMDB assoicates series with debut year, searching for a series with a different year than debut year will return N/A. To get around this year is only used when looking up movies, for series only the title is used but this could lead to false positives.

Sometimes for movies Netflix claims a certain year while the IMDB/OMDB entry is +-1, I assume this is for movies made in dec/jan. 

Some of these problems can be fixed with adding extra logic but I decided against it as there is no guarantee that fixing some corner cases will not lead to creating others and overall accuracy staying the same.

Hopefully there will eventually be a free IMDB api or OMDB will improve with more granular controls thus allowing for improved results.



