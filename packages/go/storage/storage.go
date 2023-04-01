package storage

import (
	"errors"
	"io"
	"os"

	"github.com/goccy/go-json"
	"github.com/shadowfish07/FlexiBook/config"
	"github.com/shadowfish07/FlexiBook/models"
)

type Storage struct {
	hasInit          bool
	cache            *models.Database
	MountDir         string
	DatabaseFileName string
}

func init() {
	CachedStorage = NewStorage()
	CachedStorage.Load()
}

func NewStorage() *Storage {
	return &Storage{
		cache: &models.Database{
			Tags:       make(models.Tags),
			Categories: make(models.Categories),
			Bookmarks:  make(models.Bookmarks),
		},
		MountDir:         config.MountDir,
		DatabaseFileName: "database.json",
	}
}

func (s *Storage) Save(newContext *models.Database) error {
	jsonData, err := json.Marshal(newContext)
	if err != nil {
		return err
	}

	// 避免文件目录不存在
	err = os.MkdirAll(s.MountDir, 0755)
	if err != nil {
		return err
	}

	filePath := s.MountDir + "/" + s.DatabaseFileName

	file, err := os.Create(filePath)
	if err != nil {
		return err
	}

	defer file.Close()

	_, err = file.WriteString(string(jsonData))
	if err != nil {
		return err
	}

	err = file.Sync()
	if err != nil {
		return err
	}

	return nil
}

func (s *Storage) Load() error {
	// 避免文件目录不存在
	err := os.MkdirAll(s.MountDir, 0755)
	if err != nil {
		return err
	}

	filePath := s.MountDir + "/" + s.DatabaseFileName

	file, err := os.OpenFile(filePath, os.O_CREATE|os.O_RDWR, 0644)
	if err != nil {
		return err
	}

	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return err
	}

	if fileInfo.Size() != 0 {
		fileData, err := io.ReadAll(file)
		if err != nil {
			return err
		}

		err = json.Unmarshal(fileData, s.cache)
		if err != nil {
			return errors.New("database file is broken")
		}
	}

	s.hasInit = true

	return nil
}

func (s *Storage) Get() (*models.Database, error) {
	if !s.hasInit {
		err := s.Load()
		if err != nil {
			return nil, err
		}
	}
	return s.cache, nil
}

var CachedStorage *Storage
