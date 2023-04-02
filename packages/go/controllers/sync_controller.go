package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/services"
	"github.com/shadowfish07/FlexiBook/utils/response"
)

type SyncController struct {
	syncService *services.SyncService
}

func NewSyncController() *SyncController {
	return &SyncController{
		syncService: services.NewSyncService(),
	}
}

func (sc *SyncController) GetIncrementalUpdate(ctx *gin.Context) {
	clientIncrementalId := ctx.Param("clientIncrementalId")

	ok, value := isInt64(clientIncrementalId)

	if !ok {
		response.ErrorResponse(ctx, http.StatusBadRequest, errors.New("Invalid client incremental id"))
		return
	}

	incrementalUpdate, err := sc.syncService.GetIncrementalUpdate(value)

	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, incrementalUpdate)
}

func (sc *SyncController) PostIncrementalUpdate(ctx *gin.Context) {
	var req models.Operation

	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(ctx, http.StatusBadRequest, err)
		return
	}

	afterOperations, err := sc.syncService.AddIncrementalUpdate(req)

	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, afterOperations)
}

func isInt64(s string) (bool, int64) {
	value, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		return false, 0
	}
	return true, value
}
