package models

type Category struct {
	ID        string  `json:"id" binding:"required"`
	Title     string  `json:"title" binding:"required"`
	Icon      *string `json:"icon"`
	ParentID  *ID     `json:"parentId,omitempty"`
	Children  []ID    `json:"children,omitempty"  binding:"omitempty,json"`
	CreatedAt int64   `json:"createdAt" binding:"required,number"`
	DeletedAt *int64  `json:"deletedAt,omitempty" binding:"omitempty,number"`
}
