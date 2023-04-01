package repositories

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
)

type BookmarkRepository struct {
	database *storage.Database
}

func NewBookmarkRepository() *BookmarkRepository {
	return &BookmarkRepository{
		database: storage.NewDatabase(),
	}
}

func (br *BookmarkRepository) GetByID(id string) (*models.Bookmark, error) {
	db, err := br.database.Get()
	if err != nil {
		return nil, err
	}

	bookmark, ok := db.Bookmarks[id]
	if !ok {
		return nil, errors.New("bookmark not found")
	}

	return &bookmark, nil
}

func (br *BookmarkRepository) Save(model models.Bookmark) error {
	db, err := br.database.Get()
	if err != nil {
		return err
	}

	db.Bookmarks[model.ID] = model

	return br.database.Save(db)
}
