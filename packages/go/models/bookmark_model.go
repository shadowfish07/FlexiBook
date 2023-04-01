package models

type Bookmark struct {
	ID         string  `json:"id"`
	Title      string  `json:"title"`
	URL        string  `json:"url"`
	Category   ID      `json:"category"`
	Tags       []ID    `json:"tags,omitempty"`
	DeletedAt  *int64  `json:"deletedAt,omitempty"`
	CreatedAt  int64   `json:"createdAt"`
	Icon       *string `json:"icon,omitempty"`
	IsFavorite *bool   `json:"isFavorite,omitempty"`
}
