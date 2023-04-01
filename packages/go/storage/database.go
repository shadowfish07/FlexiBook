package storage

import (
	"github.com/shadowfish07/FlexiBook/models"
)

type Database struct {
}

func NewDatabase() *Database {
	return &Database{}
}

func (dr *Database) NewDatabase() *models.Database {
	return &models.Database{}
}

// func (dr *Database) SetTags(value models.Tags) error {
// 	data, err := dr.Get()
// 	if err != nil {
// 		return err
// 	}
// 	data.Tags = value
// 	return CachedStorage.Save(data)
// }

func (dr *Database) Save(value *models.Database) error {
	return CachedStorage.Save(value)
}

func (dr *Database) Load() error {
	return CachedStorage.Load()
}

func (dr *Database) Get() (*models.Database, error) {
	return CachedStorage.Get()
}
