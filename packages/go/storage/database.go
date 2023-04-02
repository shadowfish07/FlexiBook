package storage

import (
	"errors"

	"github.com/goccy/go-json"
	"github.com/shadowfish07/FlexiBook/models"
)

type Database struct {
	storage          *Storage
	cache            *models.Database
	DatabaseFileName string
	hasInit          bool
}

func init() {
	CachedDatabase = NewDatabase()
}

func NewDatabase() *Database {
	return &Database{cache: &models.Database{
		Tags:       make(models.Tags),
		Categories: make(models.Categories),
		Bookmarks:  make(models.Bookmarks),
	},
		DatabaseFileName: "database.json",
		hasInit:          false,
		storage:          NewStorage(),
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

	dr.cache = value
	return dr.storage.Save(dr.DatabaseFileName, jsonData)
}

func (dr *Database) load() error {
	fileData, err := dr.storage.Load(dr.DatabaseFileName)
	if err != nil {
		return err
	}

	dr.hasInit = true

	if fileData == nil || len(fileData) == 0 {
		return nil
	}

	err = json.Unmarshal(fileData, dr.cache)
	if err != nil {
		return errors.New("database file is broken")
	}

	return nil
}

func (dr *Database) Get() (*models.Database, error) {
	if !dr.hasInit {
		err := dr.load()
		if err != nil {
			return nil, err
		}
	}
	return dr.cache, nil
}

var CachedDatabase *Database
