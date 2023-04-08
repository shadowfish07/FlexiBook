package services

import (
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
)

type BlobService struct {
	blobRepository *repositories.BlobRepository
}

func NewBlobService(blobRepository *repositories.BlobRepository) *BlobService {
	return &BlobService{
		blobRepository: blobRepository,
	}
}

func (bs *BlobService) newBlob(blob models.Blob) (*models.Blob, error) {
	if ok, _ := bs.IsExist(models.ID(blob.ID)); ok {
		return nil, errors.New("Blob ID already exists")
	}

	err := validator.New().Struct(blob)
	if err != nil {
		return nil, err
	}

	return &blob, nil
}

func (bs *BlobService) CreateBlob(blobParams models.Blob) (*models.Blob, error) {
	blob, err := bs.newBlob(blobParams)

	if err != nil {
		return nil, err
	}

	err = bs.blobRepository.Save(blob)

	return blob, err
}

func (bs *BlobService) IsExist(id models.ID) (bool, error) {
	return bs.blobRepository.IsExist(id)
}

func (bs *BlobService) GetBlob(id models.ID) (*models.Blob, error) {
	return bs.blobRepository.Get(id)
}

func (bs *BlobService) UpdateBlob(id models.ID, blobParams models.Blob) (*models.Blob, error) {
	blob, err := bs.blobRepository.Get(id)
	if err != nil {
		return nil, err
	}

	err = bs.blobRepository.Save(blob)

	return blob, err
}

func (bs *BlobService) DeleteBlob(id models.ID) error {
	return bs.blobRepository.Delete(id)
}
