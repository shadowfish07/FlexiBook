chrome.bookmarks.onCreated.addListener(function (id, bookmarks) {
  // do something
  console.log("bookmark created", id, bookmarks);
});
