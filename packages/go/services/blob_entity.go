package services

import (
	"errors"

	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/utils"
)

type BlobEntity struct {
	blobService *BlobService
}

func NewBlobEntity(blobService *BlobService) *BlobEntity {
	return &BlobEntity{
		blobService: blobService,
	}
}

func getBlobFromData(id models.ID, data map[string]interface{}, isCreate bool) (*models.Blob, error) {
	content, err := utils.GetStringFromMap(data, "content")
	if err != nil {
		return nil, err
	}
	var finalContent string = ""
	if content == nil {
		if isCreate {
			return nil, errors.New("content is required")
		}
	} else {
		finalContent = *content
	}

	return &models.Blob{
		ID:      string(id),
		Content: finalContent,
	}, nil
}

func (be *BlobEntity) Create(id models.ID, data map[string]interface{}) error {
	newBlob, err := getBlobFromData(id, data, true)
	if err != nil {
		return err
	}

	_, err = be.blobService.CreateBlob(*newBlob)

	return err
}

func (be *BlobEntity) Update(id models.ID, data map[string]interface{}) error {
	updatedBlob, err := getBlobFromData(id, data, false)
	if err != nil {
		return err
	}

	_, err = be.blobService.UpdateBlob(id, *updatedBlob)

	return err
}

func (be *BlobEntity) Delete(id models.ID) error {

	return be.blobService.DeleteBlob(id)
}
