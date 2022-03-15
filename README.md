# CollabCollage
CollabCollage is a MERN app that interfaces with the Discogs API to search for collaborations between musical artists. You can use it to unearth unexpected intersections, trace creative partnerships, and visualize new aspects of your favorite artists' careers.

## About CollabCollage
CollabCollage works by searching the Discogs database to find the desired artist. Once the correct artists are selected, it queries Discogs to return all artists' discographies, at a rate of 100 releases per second. If an artist's discography takes up at least 45 pages, CollabCollage will create a backup of that artist's discography in a MongoDB database. An artist's existing MongoDB backup will update if the Discogs copy has gained at least 15 entries and if the last backup was made more than one week prior.

## Changelog
**1.1.1**
* Fixed error in which search bar would hide results due to strict matching of input whitespace.
**1.1.0**
* Added option to limit search results to releases containing all artists instead of various combinations of two or more artists
* Pop-up window now closes when clicked outside of window instead of only when closed with "x"