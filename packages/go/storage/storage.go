package storage

import (
	"io"
	"os"
	"path/filepath"

	"github.com/spf13/afero"
)

type Storage struct {
	MountDir string
	Fs       afero.Fs
}

func NewStorage(mountDir string, fs afero.Fs) *Storage {
	return &Storage{
		MountDir: mountDir,
		Fs:       fs,
	}
}

func (s *Storage) Save(fileName string, newContext []byte) error {
	filePath := s.MountDir + "/" + fileName
	dirPath := filepath.Dir(filePath)

	// 避免文件目录不存在
	err := os.MkdirAll(dirPath, 0755)
	if err != nil {
		return err
	}

	file, err := s.Fs.Create(filePath)
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

	file, err := s.Fs.OpenFile(filePath, os.O_CREATE|os.O_RDWR, 0644)
	if err != nil {
		return nil, err
	}

	defer file.Close()

	return io.ReadAll(file)
}
