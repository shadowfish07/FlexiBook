package services

import (
	"fmt"

	"github.com/shadowfish07/FlexiBook/models"
)

type Entity struct {
	BookmarkEntity *BookmarkEntity
	CategoryEntity *CategoryEntity
	TagEntity      *TagEntity
	BlobEntity     *BlobEntity
}

func NewEntity(BookmarkEntity *BookmarkEntity,
	CategoryEntity *CategoryEntity,
	TagEntity *TagEntity,
	BlobEntity *BlobEntity) *Entity {
	return &Entity{
		BookmarkEntity: BookmarkEntity,
		CategoryEntity: CategoryEntity,
		TagEntity:      TagEntity,
		BlobEntity:     BlobEntity,
	}
}

func (e *Entity) CreateEntity(entityType string) models.Entity {
	switch entityType {
	case models.OperationActionEntityBookmark:
		return e.BookmarkEntity
	case models.OperationActionEntityCategory:
		return e.CategoryEntity
	case models.OperationActionEntityTag:
		return e.TagEntity
	case models.OperationActionEntityBlob:
		return e.BlobEntity
	default:
		return nil
	}
}

func ProcessAction(entity models.Entity, entityId models.ID, actionType string, data map[string]interface{}) error {
	switch actionType {
	case models.OperationActionTypeCreate:
		return entity.Create(entityId, data)
	case models.OperationActionTypeUpdate:
		return entity.Update(entityId, data)
	case models.OperationActionTypeDelete:
		return entity.Delete(entityId)
	default:
		return fmt.Errorf("invalid action type: %s", actionType)
	}
}
