package main

import (
	"log"

	"github.com/shadowfish07/FlexiBook/config"
	"github.com/shadowfish07/FlexiBook/wire"
)

func main() {
	engine, err := wire.InitializeApp(config.MountDir, false)
	if err != nil {
		log.Fatalf("Failed to initialize app: %v", err)
	}

	err = engine.Run(":8080")
	if err != nil {
		log.Fatalf("Failed to run gin.Engine: %v", err)
	}
}
