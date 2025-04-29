package config

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MongoClient *mongo.Client

func ConnectMongoDB() (*mongo.Client, error) {
	err := godotenv.Load()
	if err != nil {
		log.Println(".env não encontrado, seguindo com variáveis do sistema")
	}

	user := os.Getenv("MONGO_USER")
	pass := os.Getenv("MONGO_PASSWORD")

	if user == "" || pass == "" {
		return nil, fmt.Errorf("MONGO_USER ou MONGO_PASSWORD não definidos")
	}

	uri := fmt.Sprintf("mongodb://%s:%s@localhost:27017", user, pass)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI(uri)

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("erro ao conectar no MongoDB: %v", err)
	}

	if err := client.Ping(ctx, nil); err != nil {
		return nil, fmt.Errorf("falha ao dar ping no MongoDB: %v", err)
	}

	log.Println("Conectado com sucesso ao MongoDB!")
	MongoClient = client
	return client, nil
}
