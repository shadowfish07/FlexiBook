package models

type Category struct {
	ID        string   `json:"id"`
	Title     string   `json:"title"`
	Icon      string   `json:"icon"`
	ParentID  *ID      `json:"parentId,omitempty"`
	DeletedAt *int64   `json:"deletedAt,omitempty"`
	Children  []string `json:"children,omitempty"`
}
