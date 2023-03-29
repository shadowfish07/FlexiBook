package controllers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/services"
	"github.com/shadowfish07/FlexiBook/utils/response"
)

type WebsiteController struct {
	websiteService services.WebsiteService
}

func NewWebsiteController() *WebsiteController {
	return &WebsiteController{websiteService: *services.NewWebsiteService()}
}

func (wc *WebsiteController) GetMeta(ctx *gin.Context) {
	url := ctx.Query("url")

	if url == "" {
		response.ErrorResponse(ctx, http.StatusBadRequest, errors.New("url is required"))
		return
	}

	meta, err := wc.websiteService.GetMeta(url)

	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, meta)
}

func (wc *WebsiteController) GetIcon(ctx *gin.Context) {
	url := ctx.Query("url")

	if url == "" {
		response.ErrorResponse(ctx, http.StatusBadRequest, errors.New("url is required"))
		return
	}

	icon, err := wc.websiteService.GetIcon(url)

	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.ByteResponse(ctx, "image/x-icon", icon)
}
