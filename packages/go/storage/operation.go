package storage

import (
	"errors"
	"log"
	"sort"

	"github.com/goccy/go-json"
	"github.com/shadowfish07/FlexiBook/models"
)

type Operation struct {
	hasInit           bool
	storage           *Storage
	operationFileName string
	cache             models.OperationList
}

func NewOperation(storage *Storage) *Operation {
	return &Operation{
		operationFileName: "operation.json",
		hasInit:           false,
		storage:           storage,
		cache:             make(models.OperationList, 0),
	}
}

func (o *Operation) load() error {
	fileData, err := o.storage.Load(o.operationFileName)
	if err != nil {
		return err
	}

	o.hasInit = true

	if fileData == nil || len(fileData) == 0 {
		return nil
	}

	err = json.Unmarshal(fileData, &o.cache)
	if err != nil {
		log.Println(err)
		return errors.New("database file is broken")
	}

	// sort by id
	sort.Slice(o.cache, func(i, j int) bool {
		return o.cache[i].Id < o.cache[j].Id
	})

	return nil
}

func (o *Operation) Save(value models.OperationList) error {
	jsonData, err := json.Marshal(value)
	if err != nil {
		return err
	}

	o.cache = value
	return o.storage.Save(o.operationFileName, jsonData)
}

func (o *Operation) Get() (models.OperationList, error) {
	if !o.hasInit {
		err := o.load()
		if err != nil {
			return nil, err
		}
	}
	return o.cache, nil
}
