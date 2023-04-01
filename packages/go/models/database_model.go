package models

type Tags map[string]Tag
type Categories map[string]Category
type Bookmarks map[string]Bookmark

type Database struct {
	Tags       Tags       `json:"tags"`
	Categories Categories `json:"categories"`
	Bookmarks  Bookmarks  `json:"bookmarks"`
}
