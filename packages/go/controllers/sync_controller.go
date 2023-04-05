package controllers

import (
	"errors"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/services"
	"github.com/shadowfish07/FlexiBook/utils"
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
	var req models.PartialOperation

	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(ctx, http.StatusBadRequest, err)
		return
	}

	if req.UniqueId == nil {
		uuidV4, _ := uuid.NewRandom()
		uuidString := uuidV4.String()
		req.UniqueId = &uuidString
	}

	if req.CreateAt == nil {
		timestamp := utils.GetTimestamp()
		req.CreateAt = &timestamp
	}

	completeReq := models.Operation{
		Id:       req.Id,
		UniqueId: *req.UniqueId,
		CreateAt: *req.CreateAt,
		ClientId: req.ClientId,
		Actions:  req.Actions,
	}

	afterOperations, err := sc.syncService.AddIncrementalUpdate(completeReq)

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
