package models

type Tag struct {
	ID        string `json:"id" binding:"required"`
	Title     string `json:"title" binding:"required"`
	Color     string `json:"color"`
	ParentID  *ID    `json:"parentId,omitempty"`
	Children  []ID   `json:"children,omitempty" binding:"omitempty,json"`
	CreatedAt int64  `json:"createdAt" binding:"required,number"`
	DeletedAt *int64 `json:"deletedAt,omitempty" binding:"omitempty,number"`
}
