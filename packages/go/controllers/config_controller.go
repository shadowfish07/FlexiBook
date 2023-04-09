package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/services"
	"github.com/shadowfish07/FlexiBook/utils/response"
)

type ConfigController struct {
	configService *services.ConfigService
}

func NewConfigController(configService *services.ConfigService) *ConfigController {
	return &ConfigController{
		configService: configService,
	}
}

func (cc *ConfigController) Update(ctx *gin.Context) {
	var req models.Config

	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(ctx, http.StatusBadRequest, err)
		return
	}

	err := cc.configService.Update(&req)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, nil)
}
