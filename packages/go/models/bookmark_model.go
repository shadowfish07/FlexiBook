package models

type Bookmark struct {
	ID         string  `json:"id" binding:"required"`
	Title      string  `json:"title" binding:"required"`
	URL        string  `json:"url" binding:"required,url"`
	Category   *ID     `json:"category"`
	Tags       []ID    `json:"tags,omitempty" binding:"omitempty,json"`
	DeletedAt  *int64  `json:"deletedAt,omitempty" binding:"omitempty,number"`
	CreatedAt  int64   `json:"createdAt" binding:"required,number"`
	Icon       *string `json:"icon,omitempty" binding:"omitempty"`
	IsFavorite *bool   `json:"isFavorite,omitempty" binding:"omitempty"`
}
