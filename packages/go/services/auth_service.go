package services

import (
	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
	"github.com/shadowfish07/FlexiBook/utils"
)

type AuthService struct {
	configRepository *repositories.ConfigRepository
	oauthRepository  *repositories.OauthRepository
}

func NewAuthService(configRepository *repositories.ConfigRepository,
	oauthRepository *repositories.OauthRepository) *AuthService {
	return &AuthService{
		configRepository: configRepository,
		oauthRepository:  oauthRepository,
	}
}

// 第二个参数表示是否是管理员的client
func (sa *AuthService) GetClientSecret(clientId string) (string, bool, error) {
	clientInfo, err := sa.configRepository.GetClientInfo()
	if err != nil {
		return "", false, err
	}

	if clientInfo == nil {
		return "", false, nil
	}

	if clientInfo.ClientId == clientId {
		return clientInfo.ClientSecret, true, nil
	}

	oauthItem, err := sa.oauthRepository.Get(clientId)
	if err != nil {
		return "", false, err
	}

	if oauthItem != nil {
		return oauthItem.Secret, false, nil
	}

	return "", false, nil
}

func (sa *AuthService) DeleteOauthItem(clientId string) error {
	oauthItem, err := sa.oauthRepository.Get(clientId)
	if err != nil {
		return err
	}

	timestamp := utils.GetTimestamp()

	oauthItem.DeletedAt = &timestamp

	return sa.oauthRepository.Update(oauthItem)
}

func (sa *AuthService) AddOauthItem(oauthItem *models.OauthItem) (*models.OauthItem, error) {

	if oauthItem.Secret == "" {
		uuidV4, _ := uuid.NewRandom()
		uuidString := uuidV4.String()
		oauthItem.Secret = uuidString
	}

	err := validator.New().Struct(oauthItem)
	if err != nil {
		return nil, err
	}

	err = sa.oauthRepository.Add(oauthItem)
	if err != nil {
		return nil, err
	}

	return oauthItem, nil
}

func (sa *AuthService) UpdateOauthItem(oauthItem *models.OauthItem) error {
	return sa.oauthRepository.Update(oauthItem)
}

func (sa *AuthService) GetOauthItem(clientId string) (*models.OauthItem, error) {
	return sa.oauthRepository.Get(clientId)
}

func (sa *AuthService) GetAllOauth() (*models.Oauth, error) {
	return sa.oauthRepository.GetOauth()
}
