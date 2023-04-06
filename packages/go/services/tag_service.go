package services

import (
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
	"github.com/shadowfish07/FlexiBook/utils"
)

type TagService struct {
	tagRepository *repositories.TagRepository
}

func NewTagService(tagRepository *repositories.TagRepository) *TagService {
	return &TagService{
		tagRepository: tagRepository,
	}
}

func (ts *TagService) newTag(tag models.Tag) (*models.Tag, error) {
	uuidV4, _ := uuid.NewRandom()

	if tag.ID == "" {
		tag.ID = uuidV4.String()
	}
	if tag.CreatedAt == 0 {
		tag.CreatedAt = utils.GetTimestamp()
	}

	if existingTag, _ := ts.GetTag(models.ID(tag.ID)); existingTag != nil {
		return nil, errors.New("Tag ID already exists")
	}

	err := validator.New().Struct(tag)
	if err != nil {
		return nil, err
	}

	return &tag, nil
}

func (ts *TagService) CreateTag(tagParams models.Tag) (*models.Tag, error) {
	tag, err := ts.newTag(tagParams)

	if err != nil {
		return nil, err
	}

	err = ts.tagRepository.Save(*tag)

	return tag, err
}

func (ts *TagService) GetTag(id models.ID) (*models.Tag, error) {
	tag, err := ts.tagRepository.Get(id)

	return tag, err
}

func (ts *TagService) UpdateTag(id models.ID, tagParams models.Tag) (*models.Tag, error) {
	tag, err := ts.tagRepository.Get(id)
	if err != nil {
		return nil, err
	}

	if tagParams.Title != "" {
		tag.Title = tagParams.Title
	}
	if tagParams.Color != "" {
		tag.Color = tagParams.Color
	}
	if tagParams.ParentID != nil {
		tag.ParentID = tagParams.ParentID
	}
	if tagParams.Children != nil {
		tag.Children = tagParams.Children
	}
	if tagParams.DeletedAt != nil {
		tag.DeletedAt = tagParams.DeletedAt
	}

	err = ts.tagRepository.Save(*tag)

	return tag, err
}

func (ts *TagService) DeleteTag(id models.ID) error {
	tag, err := ts.tagRepository.Get(id)
	if err != nil {
		return err
	}
	timestamp := utils.GetTimestamp()

	tag.DeletedAt = &timestamp

	return ts.tagRepository.Save(*tag)
}
