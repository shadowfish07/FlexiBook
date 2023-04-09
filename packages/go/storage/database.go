package storage

import (
	"errors"
	"log"

	"github.com/goccy/go-json"
	"github.com/shadowfish07/FlexiBook/models"
)

type Database struct {
	storage          *Storage
	DatabaseFileName string
}

func NewDatabase(storage *Storage) *Database {
	return &Database{
		DatabaseFileName: "database.json",
		storage:          storage,
	}
}

func (dr *Database) NewDatabase() *models.Database {
	return &models.Database{}
}

func (dr *Database) Save(value *models.Database) error {
	jsonData, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return dr.storage.Save(dr.DatabaseFileName, jsonData)
}

func (dr *Database) load() (*models.Database, error) {
	fileData, err := dr.storage.Load(dr.DatabaseFileName)
	if err != nil {
		return nil, err
	}

	if fileData == nil || len(fileData) == 0 {
		return nil, nil
	}

	var result models.Database
	err = json.Unmarshal(fileData, &result)
	if err != nil {
		log.Default().Println(err)
		return nil, errors.New("database file is broken")
	}

	return &result, nil
}

func (dr *Database) Get() (*models.Database, error) {
	return dr.load()
}
