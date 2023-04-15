package storage

import (
	"errors"
	"log"

	"github.com/goccy/go-json"
	"github.com/shadowfish07/FlexiBook/models"
)

type Oauth struct {
	storage       *Storage
	oauthFileName string
}

func NewOauth(storage *Storage) *Oauth {
	return &Oauth{
		storage:       storage,
		oauthFileName: "oauth.json",
	}
}

func (o *Oauth) load() (*models.Oauth, error) {
	fileData, err := o.storage.Load(o.oauthFileName)
	if err != nil {
		return nil, err
	}

	if fileData == nil || len(fileData) == 0 {
		return &models.Oauth{
			OauthItems:               []models.OauthItem{},
			Invitations:              []models.Invitation{},
			InvitationUsageHistories: []models.InvitationUsageHistory{},
		}, nil
	}

	var result models.Oauth
	err = json.Unmarshal(fileData, &result)
	if err != nil {
		log.Println(err)
		return nil, errors.New("oauth file is broken")
	}

	return &result, nil
}

func (o *Oauth) Save(value *models.Oauth) error {
	jsonData, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return o.storage.Save(o.oauthFileName, jsonData)
}

func (o *Oauth) Get() (*models.Oauth, error) {
	return o.load()
}
