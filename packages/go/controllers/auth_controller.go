package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/services"
	"github.com/shadowfish07/FlexiBook/utils/response"
)

type AuthController struct {
	authService       *services.AuthService
	invitationService *services.InvitationService
}

func NewAuthController(authService *services.AuthService,
	invitationService *services.InvitationService) *AuthController {
	return &AuthController{
		authService:       authService,
		invitationService: invitationService,
	}
}

func (ac *AuthController) AddInvitation(ctx *gin.Context) {
	var req models.Invitation

	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(ctx, http.StatusBadRequest, err)
		return
	}

	err := ac.invitationService.Add(&req)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, nil)
}

func (ac *AuthController) UpdateInvitation(ctx *gin.Context) {
	var req models.Invitation

	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(ctx, http.StatusBadRequest, err)
		return
	}

	err := ac.invitationService.Update(&req)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, nil)
}

func (ac *AuthController) DeleteInvitation(ctx *gin.Context) {
	id := ctx.Param("id")

	err := ac.invitationService.Delete(id)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, nil)
}

func (ac *AuthController) GetAllInvitation(ctx *gin.Context) {
	invitations, err := ac.invitationService.GetAll()
	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, invitations)
}

// 无需鉴权
func (ac *AuthController) ActivateInvitation(ctx *gin.Context) {
	id := ctx.Param("id")
	var req models.ActivateInvitationRequest

	if err := ctx.ShouldBindJSON(&req); err != nil {
		response.ErrorResponse(ctx, http.StatusBadRequest, err)
		return
	}

	_clientId, _ := ctx.Get("clientId")
	clientId := _clientId.(string)

	secret, err := ac.invitationService.Activate(id, clientId, req)
	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, secret)
}

func (ac *AuthController) GetAllOauthData(ctx *gin.Context) {
	data, err := ac.authService.GetAllOauth()
	if err != nil {
		response.ErrorResponse(ctx, http.StatusInternalServerError, err)
		return
	}

	response.JSONResponse(ctx, data)
}
