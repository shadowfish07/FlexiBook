package models

type Tag struct {
	ID        string   `json:"id"`
	Title     string   `json:"title"`
	Color     string   `json:"color"`
	DeletedAt *int64   `json:"deletedAt,omitempty"`
	ParentID  *ID      `json:"parentId,omitempty"`
	Children  []string `json:"children,omitempty"`
}
