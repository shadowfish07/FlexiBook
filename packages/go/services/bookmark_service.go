package services

import (
	"errors"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
	"github.com/shadowfish07/FlexiBook/models"
	"github.com/shadowfish07/FlexiBook/repositories"
	"github.com/shadowfish07/FlexiBook/utils"
)

type BookmarkService struct {
	bookmarkRepository *repositories.BookmarkRepository
}

func NewBookmarkService(bookmarkRepository *repositories.BookmarkRepository) *BookmarkService {
	return &BookmarkService{
		bookmarkRepository: bookmarkRepository,
	}
}

func (bs *BookmarkService) newBookmark(bookmark models.Bookmark) (*models.Bookmark, error) {
	uuidV4, _ := uuid.NewRandom()

	if bookmark.ID == "" {
		bookmark.ID = uuidV4.String()
	}
	if bookmark.CreatedAt == 0 {
		bookmark.CreatedAt = utils.GetTimestamp()
	}

	existingBookmark, err := bs.bookmarkRepository.Get(models.ID(bookmark.ID))

	if err == repositories.ErrorBookmarkNotFind {
		err = validator.New().Struct(bookmark)
		if err != nil {
			return nil, err
		}

		return &bookmark, nil
	} else {
		if existingBookmark != nil {
			return nil, errors.New("Bookmark ID already exists")
		}
	}

	return nil, err
}

func (bs *BookmarkService) CreateBookmark(bookmarkParams models.Bookmark) (*models.Bookmark, error) {
	bookmark, err := bs.newBookmark(bookmarkParams)

	if err != nil {
		return nil, err
	}

	err = bs.bookmarkRepository.Save(*bookmark)

	return bookmark, err
}

func (bs *BookmarkService) GetBookmark(id models.ID) (*models.Bookmark, error) {
	bookmark, err := bs.bookmarkRepository.Get(id)

	return bookmark, err
}

func (bs *BookmarkService) UpdateBookmark(id models.ID, bookmarkParams models.Bookmark) (*models.Bookmark, error) {
	bookmark, err := bs.bookmarkRepository.Get(id)

	if err != nil {
		return nil, err
	}

	// 不允许修改 ID\CreatedAt
	if bookmarkParams.Title != "" {
		bookmark.Title = bookmarkParams.Title
	}
	if bookmarkParams.URL != "" {
		bookmark.URL = bookmarkParams.URL
	}
	if bookmarkParams.Category != nil {
		bookmark.Category = bookmarkParams.Category
	}
	if bookmarkParams.Icon != nil {
		bookmark.Icon = bookmarkParams.Icon
	}
	if bookmarkParams.DeletedAt != nil {
		bookmark.DeletedAt = bookmarkParams.DeletedAt
	}
	if bookmarkParams.IsFavorite != nil {
		bookmark.IsFavorite = bookmarkParams.IsFavorite
	}
	if bookmarkParams.Tags != nil {
		bookmark.Tags = bookmarkParams.Tags
	}

	err = bs.bookmarkRepository.Save(*bookmark)

	return bookmark, err
}

func (bs *BookmarkService) DeleteBookmark(id models.ID) error {
	bookmark, err := bs.bookmarkRepository.Get(id)
	if err != nil {
		return err
	}

	timestamp := utils.GetTimestamp()

	bookmark.DeletedAt = &timestamp

	return bs.bookmarkRepository.Save(*bookmark)
}
