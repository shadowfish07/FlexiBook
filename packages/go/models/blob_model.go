package models

type Blob struct {
	ID      string `json:"id" binding:"required"`
	Content string `json:"content" binding:"required"`
}
