package services

import (
	"errors"
	"time"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
	"github.com/shadowfish07/FlexiBook/utils"
)

type InvitationService struct {
	invitationRepository *repositories.InvitationRepository
	oauthRepository      *repositories.OauthRepository
	authService          *AuthService
}

func NewInvitationService(invitationRepository *repositories.InvitationRepository,
	oauthRepository *repositories.OauthRepository,
	authService *AuthService) *InvitationService {
	return &InvitationService{
		invitationRepository: invitationRepository,
		oauthRepository:      oauthRepository,
		authService:          authService,
	}
}

func (is *InvitationService) Get(id string) (*models.Invitation, error) {
	return is.invitationRepository.Get(id)
}

func (is *InvitationService) GetAll() ([]models.Invitation, error) {
	return is.invitationRepository.GetAll()
}

func (is *InvitationService) Update(invitation *models.Invitation) error {
	if _, err := is.Get(invitation.Id); err != nil {
		return err
	}

	return is.invitationRepository.Update(invitation)
}

func (is *InvitationService) Add(invitation *models.Invitation) error {
	return is.invitationRepository.Add(invitation)
}

func (is *InvitationService) Delete(id string) error {
	if _, err := is.Get(id); err != nil {
		return err
	}

	histories, err := is.invitationRepository.GetAllUsageHistories()
	if err != nil {
		return err
	}

	// 删除邀请码的同时，删除邀请码对应的权限
	for _, history := range histories {
		oauthItem, err := is.oauthRepository.Get(history.ClientId)
		if err != nil {
			return err
		}

		if oauthItem != nil {
			for i, permission := range oauthItem.Permissions {
				if permission.InvitationId == history.InvitationId {
					oauthItem.Permissions = append(oauthItem.Permissions[:i], oauthItem.Permissions[i+1:]...)
				}
			}
		}

		err = is.oauthRepository.Update(oauthItem)
		if err != nil {
			return err
		}
	}

	return is.invitationRepository.Delete(id)
}

func (is *InvitationService) Activate(id string, clientId string, activateInvitationRequest models.ActivateInvitationRequest) (string, string, error) {
	invitation, err := is.Get(id)
	if err != nil {
		return "", "", err
	}

	err = is.CheckInvitationValid(invitation, activateInvitationRequest.Password)
	if err != nil {
		return "", "", err
	}

	existOauthItem, err := is.authService.GetOauthItem(clientId)
	if err != nil {
		return "", "", err
	}

	var secret string
	if existOauthItem != nil {
		secret = existOauthItem.Secret
		// 权限合并，取并集
		for _, invitationPermission := range invitation.DefaultPermissions {
			foundSame := false
			for _, userPermission := range existOauthItem.Permissions {
				if invitationPermission == userPermission {
					foundSame = true
					break
				}
			}
			if !foundSame {
				existOauthItem.Permissions = append(existOauthItem.Permissions, invitationPermission)
			}
		}

		is.authService.UpdateOauthItem(existOauthItem)
	} else {
		newOauthItem := &models.OauthItem{
			ClientId:    clientId,
			Nickname:    activateInvitationRequest.Nickname,
			DeletedAt:   nil,
			CreatedAt:   utils.GetTimestamp(),
			Permissions: invitation.DefaultPermissions,
		}
		addedOauthItem, err := is.authService.AddOauthItem(newOauthItem)
		if err != nil {
			return "", "", err
		}
		secret = addedOauthItem.Secret
	}

	newInvitationUsageHistory := &models.InvitationUsageHistory{
		InvitationId: invitation.Id,
		ClientId:     clientId,
		CreatedAt:    utils.GetTimestamp(),
	}

	err = is.invitationRepository.AddUsageHistory(newInvitationUsageHistory)
	if err != nil {
		return "", "", err
	}

	nickname, err := is.oauthRepository.GetMonitorNickname()
	if err != nil {
		return "", "", err
	}

	return secret, nickname, nil
}

func (is *InvitationService) CheckInvitationValid(invitation *models.Invitation, password *string) error {
	if invitation == nil {
		return errors.New("Invitation is not found")
	}

	if invitation.DeletedAt != nil {
		return errors.New("Invitation is not valid")
	}

	if invitation.UsesUntil != 0 && invitation.UsesUntil < time.Now().UnixMilli() {
		return errors.New("Invitation is expired")
	}

	if count, _ := is.GetInvitationUsedCount(invitation.Id); invitation.UsesLimit != 0 && invitation.UsesLimit <= int64(count) {
		return errors.New("Invitation is used out")
	}

	if password != nil && password != &invitation.Password {
		return errors.New("Password is not correct")
	}

	return nil
}

func (is *InvitationService) GetInvitationUsedCount(id string) (int, error) {
	usageHistories, err := is.invitationRepository.GetAllUsageHistories()
	if err != nil {
		return 0, err
	}

	used := 0
	for _, history := range usageHistories {
		if history.InvitationId == id {
			used++
		}
	}

	return used, nil
}
