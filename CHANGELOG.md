# Changelog

## 0.0.3
* New UI, now using mdbootstrap
  * Slightly more space efficient display
* Improved naming of images and containers in both summary and detailed views
  * Remove leading slashes from container names
  * Standardise naming across the various pages for images, now the same name will appear in all views
* Behold will now sort the image summaries by number of running containers in the image summary view
  * This will place "more important" images towards the top of the page
* Added container log display
  * This is limited to 300 lines of display in order to prevent containers with large amounts of logs slowing down the app
* Added a `next` tag to the build, allowing the dev version of Behold to be installed easily
  * `docker pull huddo121/behold:next`
* Added a changelog to keep track of changes in each release
* Improve port and volume display for container details view
