package repositories

import (
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/storage"
)

type BlobRepository struct {
	blobStorage *storage.Blob
}

func NewBlobRepository(blobStorage *storage.Blob) *BlobRepository {
	return &BlobRepository{
		blobStorage: blobStorage,
	}
}

func (br *BlobRepository) Get(id models.ID) (*models.Blob, error) {
	return br.blobStorage.Load(string(id))
}

func (br *BlobRepository) Save(blob *models.Blob) error {
	return br.blobStorage.Save(blob)
}

func (br *BlobRepository) Delete(id models.ID) error {
	return br.blobStorage.Delete(string(id))
}
