package storage

import (
	"io"
	"os"

	"github.com/shadowfish07/FlexiBook/config"
)

type Storage struct {
	MountDir string
}

func NewStorage() *Storage {
	return &Storage{
		MountDir: config.MountDir,
	}
}

func (s *Storage) Save(fileName string, newContext []byte) error {
	// 避免文件目录不存在
	err := os.MkdirAll(s.MountDir, 0755)
	if err != nil {
		return err
	}

	filePath := s.MountDir + "/" + fileName

	file, err := os.Create(filePath)
	if err != nil {
		return err
	}

	defer file.Close()

	_, err = file.Write(newContext)
	if err != nil {
		return err
	}

	err = file.Sync()
	if err != nil {
		return err
	}

	return nil
}

func (s *Storage) Load(fileName string) ([]byte, error) {
	// 避免文件目录不存在
	err := os.MkdirAll(s.MountDir, 0755)
	if err != nil {
		return nil, err
	}

	filePath := s.MountDir + "/" + fileName

	file, err := os.OpenFile(filePath, os.O_CREATE|os.O_RDWR, 0644)
	if err != nil {
		return nil, err
	}

	defer file.Close()

	return io.ReadAll(file)
}
