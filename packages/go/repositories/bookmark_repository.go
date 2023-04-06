package repositories

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
)

type BookmarkRepository struct {
	database *storage.Database
}

var ErrorBookmarkNotFind = errors.New("bookmark not found")

func NewBookmarkRepository(database *storage.Database) *BookmarkRepository {
	return &BookmarkRepository{
		database: database,
	}
}

func (br *BookmarkRepository) Get(id models.ID) (*models.Bookmark, error) {
	db, err := br.database.Get()
	if err != nil {
		return nil, err
	}

	bookmark, ok := db.Bookmarks[string(id)]
	if !ok {
		return nil, ErrorBookmarkNotFind
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
