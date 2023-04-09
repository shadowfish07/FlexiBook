package storage

import (
	"errors"
	"log"
	"sort"

	"github.com/goccy/go-json"
	"github.com/shadowfish07/FlexiBook/models"
)

type Operation struct {
	storage           *Storage
	operationFileName string
}

func NewOperation(storage *Storage) *Operation {
	return &Operation{
		operationFileName: "operation.json",
		storage:           storage,
	}
}

func (o *Operation) load() (models.OperationList, error) {
	fileData, err := o.storage.Load(o.operationFileName)
	if err != nil {
		return nil, err
	}

	if fileData == nil || len(fileData) == 0 {
		return nil, nil
	}

	var result models.OperationList
	err = json.Unmarshal(fileData, &result)
	if err != nil {
		log.Println(err)
		return nil, errors.New("database file is broken")
	}

	// sort by id
	sort.Slice(result, func(i, j int) bool {
		return result[i].Id < result[j].Id
	})

	return result, nil
}

func (o *Operation) Save(value models.OperationList) error {
	jsonData, err := json.Marshal(value)
	if err != nil {
		return err
	}

	return o.storage.Save(o.operationFileName, jsonData)
}

func (o *Operation) Get() (models.OperationList, error) {
	return o.load()
}
