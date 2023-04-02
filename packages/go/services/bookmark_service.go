package services

import (
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
)

type BookmarkService struct {
	bookmarkRepository *repositories.BookmarkRepository
}

func NewBookmarkService() *BookmarkService {
	return &BookmarkService{
		bookmarkRepository: repositories.NewBookmarkRepository(),
	}
}

func (bs *BookmarkService) newBookmark(bookmark models.Bookmark) (*models.Bookmark, error) {
	uuidV4, _ := uuid.NewRandom()

	if bookmark.ID == "" {
		bookmark.ID = uuidV4.String()
	}
	if bookmark.CreatedAt == 0 {
		bookmark.CreatedAt = time.Now().UnixMilli()
	}

	// TODO 检查ID是否重复

	err := validator.New().Struct(bookmark)
	if err != nil {
		return nil, err
	}

	return &bookmark, nil
}

func (bs *BookmarkService) CreateBookmark(bookmarkParams models.Bookmark) (*models.Bookmark, error) {
	bookmark, err := bs.newBookmark(bookmarkParams)

	if err != nil {
		return nil, err
	}

	err = bs.bookmarkRepository.Save(*bookmark)

	return bookmark, err
}
