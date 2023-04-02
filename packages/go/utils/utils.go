package utils

import "time"

func GetTimestamp() int64 {
	return time.Now().UnixMilli()
}
