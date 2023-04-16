package repositories

import (
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
)

type OauthRepository struct {
	oauth *storage.Oauth
}

func NewOauthRepository(oauth *storage.Oauth) *OauthRepository {
	return &OauthRepository{
		oauth: oauth,
	}
}

func (or *OauthRepository) GetOauth() (*models.Oauth, error) {
	oauth, err := or.oauth.Get()
	if err != nil {
		return nil, err
	}

	return oauth, nil
}

func (or *OauthRepository) GetMonitorNickname() (string, error) {
	oauth, err := or.GetOauth()
	if err != nil {
		return "", err
	}

	return oauth.Nickname, nil
}

func (or *OauthRepository) Get(clientId string) (*models.OauthItem, error) {
	oauth, err := or.GetOauth()
	if err != nil {
		return nil, err
	}

	for _, item := range oauth.OauthItems {
		if item.ClientId == clientId {
			return &item, nil
		}
	}

	return nil, nil
}

func (or *OauthRepository) Save(oauth *models.Oauth) error {
	return or.oauth.Save(oauth)
}

func (or *OauthRepository) Add(oauthItem *models.OauthItem) error {
	oauth, err := or.GetOauth()
	if err != nil {
		return err
	}

	oauth.OauthItems = append(oauth.OauthItems, *oauthItem)

	return or.Save(oauth)
}

func (or *OauthRepository) Update(oauthItem *models.OauthItem) error {
	oauth, err := or.GetOauth()
	if err != nil {
		return err
	}

	for i, item := range oauth.OauthItems {
		if item.ClientId == oauthItem.ClientId {
			oauth.OauthItems[i] = *oauthItem
			break
		}
	}

	return or.Save(oauth)
}
