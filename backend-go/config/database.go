package config

import (
	"log"
)

func ConnectDatabase() {
	InitSupabase()
	log.Println("Supabase client initialized successfully")
}

