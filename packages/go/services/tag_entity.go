package services

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/utils"
)

type TagEntity struct {
	tagService *TagService
}

func NewTagEntity(tagService *TagService) *TagEntity {
	return &TagEntity{
		tagService: tagService,
	}
}

func getTagFromData(id models.ID, data map[string]interface{}, isCreate bool) (*models.Tag, error) {
	title, err := utils.GetStringFromMap(data, "title")
	if err != nil {
		return nil, err
	}
	var finalTitle string = ""
	if title == nil {
		if isCreate {
			return nil, errors.New("title is required")
		}
	} else {
		finalTitle = *title
	}

	color, err := utils.GetStringFromMap(data, "color")
	if err != nil {
		return nil, err
	}
	var finalColor string = ""
	if color != nil {
		finalColor = *color
	}

	parent, err := utils.GetStringFromMap(data, "parentId")
	if err != nil {
		return nil, err
	}

	var finalParentId *models.ID = nil
	if parent != nil {
		parentId := models.ID(*parent)
		finalParentId = &parentId
	}

	children, err := utils.GetStringSliceFromMap(data, "children")
	if err != nil {
		return nil, err
	}

	createdAt, err := utils.GetInt64FromMap(data, "createdAt")
	if err != nil {
		return nil, err
	}
	var createAtValue int64
	if createdAt == nil {
		createAtValue = 0
	} else {
		createAtValue = *createdAt
	}

	deletedAt, err := utils.GetInt64FromMap(data, "deletedAt")
	if err != nil {
		return nil, err
	}

	return &models.Tag{
		ID:        string(id),
		Title:     finalTitle,
		Color:     finalColor,
		ParentID:  finalParentId,
		Children:  utils.StringSliceToIDSlice(children),
		CreatedAt: createAtValue,
		DeletedAt: deletedAt,
	}, nil
}

func (te *TagEntity) Create(id models.ID, data map[string]interface{}) error {
	newTag, err := getTagFromData(id, data, true)
	if err != nil {
		return err
	}

	_, err = te.tagService.CreateTag(*newTag)

	return err
}

func (te *TagEntity) Update(id models.ID, data map[string]interface{}) error {
	updatedTag, err := getTagFromData(id, data, false)
	if err != nil {
		return err
	}

	_, err = te.tagService.UpdateTag(id, *updatedTag)

	return err
}

func (te *TagEntity) Delete(id models.ID) error {
	return te.tagService.DeleteTag(id)
}
