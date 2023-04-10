package services

import (
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

func (sa *AuthService) DeleteItem(clientId string) error {
	oauthItem, err := sa.oauthRepository.Get(clientId)
	if err != nil {
		return err
	}

	timestamp := utils.GetTimestamp()

	oauthItem.DeletedAt = &timestamp

	return sa.oauthRepository.Update(oauthItem)
}
