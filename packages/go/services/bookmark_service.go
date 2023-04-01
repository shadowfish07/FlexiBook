package services

import (
	"time"

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

func (bs *BookmarkService) newBookmark(bookmark models.Bookmark) *models.Bookmark {
	uuidV4, _ := uuid.NewRandom()

	bookmark.ID = uuidV4.String()
	bookmark.CreatedAt = time.Now().Unix()

	// 这里可能需要二次校验，但目前这里只会被controller调用，由controller保证参数的正确性
	// 若出现了controller外的调用方式，这里需要再次校验

	return &bookmark
}

func (bs *BookmarkService) CreateBookmark(bookmarkParams models.Bookmark) (*models.Bookmark, error) {
	bookmark := bs.newBookmark(bookmarkParams)

	err := bs.bookmarkRepository.Save(*bookmark)

	return bookmark, err
}
