package repositories

import (
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
)

type ConfigRepository struct {
	database *storage.Database
}

func NewConfigRepository(database *storage.Database) *ConfigRepository {
	return &ConfigRepository{
		database: database,
	}
}

func (sr *ConfigRepository) Get() (*models.Config, error) {
	db, err := sr.database.Get()
	if err != nil {
		return nil, err
	}

	return &db.Config, nil
}

func (sr *ConfigRepository) GetClientInfo() (*models.ClientInfo, error) {
	db, err := sr.database.Get()
	if err != nil {
		return nil, err
	}

	if db == nil {
		return nil, nil
	}

	return &models.ClientInfo{
		ClientId:     db.Config.ClientId,
		ClientSecret: db.Config.ClientSecret,
	}, nil
}

func (sr *ConfigRepository) Save(config *models.Config) error {
	db, err := sr.database.Get()
	if err != nil {
		return err
	}

	db.Config = *config

	return sr.database.Save(db)
}
