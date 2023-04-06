package repositories

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
)

type TagRepository struct {
	database *storage.Database
}

func NewTagRepository(database *storage.Database) *TagRepository {
	return &TagRepository{
		database: database,
	}
}

func (tr *TagRepository) Get(id models.ID) (*models.Tag, error) {
	db, err := tr.database.Get()
	if err != nil {
		return nil, err
	}

	tag, ok := db.Tags[string(id)]
	if !ok {
		return nil, errors.New("tag not found")
	}

	return &tag, nil
}

func (tr *TagRepository) Save(model models.Tag) error {
	db, err := tr.database.Get()
	if err != nil {
		return err
	}

	db.Tags[model.ID] = model

	return tr.database.Save(db)
}
