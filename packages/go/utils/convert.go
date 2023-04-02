package utils

import (
	"fmt"

	"github.com/shadowfish07/FlexiBook/models"
)

func GetStringFromMap(data map[string]interface{}, key string) (*string, error) {
	value, ok := data[key].(string)
	if !ok {
		if data[key] == nil {
			return nil, nil
		}
		return nil, fmt.Errorf("key '%s' is not a string", key)
	}
	return &value, nil
}

func GetInt64FromMap(data map[string]interface{}, key string) (*int64, error) {
	value, ok := data[key].(int64)
	if !ok {
		if data[key] == nil {
			return nil, nil
		}
		return nil, fmt.Errorf("key '%s' is not an int64", key)
	}
	return &value, nil
}

func GetBoolFromMap(data map[string]interface{}, key string) (*bool, error) {
	value, ok := data[key].(bool)
	if !ok {
		if data[key] == nil {
			return nil, nil
		}
		return nil, fmt.Errorf("key '%s' is not a bool", key)
	}
	return &value, nil
}

func GetStringSliceFromMap(data map[string]interface{}, key string) ([]string, error) {
	value, ok := data[key].([]string)
	if !ok {
		if data[key] == nil {
			return nil, nil
		}
		slice, ok := data[key].([]interface{})
		if !ok {
			return nil, fmt.Errorf("key '%s' is not a []string or []interface{}", key)
		}

		result := make([]string, len(slice))
		for i, v := range slice {
			str, ok := v.(string)
			if !ok {
				return nil, fmt.Errorf("element at index %d of key '%s' is not a string", i, key)
			}
			result[i] = str
		}
		return result, nil
	}
	return value, nil
}

func StringSliceToIDSlice(strings []string) []models.ID {
	ids := make([]models.ID, len(strings))

	for i, s := range strings {
		ids[i] = models.ID(s)
	}

	return ids
}
