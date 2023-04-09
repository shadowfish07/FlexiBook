package repositories

import (
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
)

type SyncRepository struct {
	database *storage.Database
}

func NewSyncRepository(database *storage.Database) *SyncRepository {
	return &SyncRepository{
		database: database,
	}
}

func (sr *SyncRepository) Init(database *models.Database) error {
	return sr.database.Save(database)
}
