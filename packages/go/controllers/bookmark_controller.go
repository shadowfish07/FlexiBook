package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/services"
	"github.com/shadowfish07/FlexiBook/utils/response"
)

type BookmarkController struct {
	bookmarkService *services.BookmarkService
}

func NewBookmarkController() *BookmarkController {
	return &BookmarkController{
		bookmarkService: services.NewBookmarkService(),
	}
}

type CreateBookmarkParams struct {
	Title      string      `json:"title" binding:"required"`
	URL        string      `json:"url" binding:"required"`
	Tags       []models.ID `json:"tags" binding:"omitempty,json"`
	Category   models.ID   `json:"category" binding:"required"`
	Icon       *string     `json:"icon"`
	IsFavorite *bool       `json:"isFavorite"`
}

func (bc *BookmarkController) CreateBookmark(ctx *gin.Context) {
	var req CreateBookmarkParams

	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(ctx, http.StatusBadRequest, err)
		return
	}

	newBookmark, err := bc.bookmarkService.CreateBookmark(models.Bookmark{
		Title:      req.Title,
		URL:        req.URL,
		Tags:       req.Tags,
		Category:   req.Category,
		Icon:       req.Icon,
		IsFavorite: req.IsFavorite,
	})

	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, newBookmark)
}
