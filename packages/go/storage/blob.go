package storage

import "github.com/shadowfish07/FlexiBook/models"

type Blob struct {
	storage *Storage
}

func NewBlob(storage *Storage) *Blob {
	return &Blob{
		storage: storage,
	}
}

func (b *Blob) Save(blob *models.Blob) error {
	fileName := "blobs/" + blob.ID

	return b.storage.Save(fileName, []byte(blob.Content))
}

func (b *Blob) IsExist(name string) (bool, error) {
	fileName := "blobs/" + name

	return b.storage.IsExist(fileName)
}

func (b *Blob) Load(name string) (*models.Blob, error) {
	fileName := "blobs/" + name

	content, err := b.storage.Load(fileName)
	if err != nil {
		return nil, err
	}

	return &models.Blob{
		ID:      name,
		Content: string(content),
	}, nil
}

func (b *Blob) Delete(name string) error {
	fileName := "blobs/" + name

	return b.storage.Delete(fileName)
}
