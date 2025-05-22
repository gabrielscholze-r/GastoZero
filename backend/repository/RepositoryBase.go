package repository

import (
	"fmt"
	"reflect"

	"github.com/rs/zerolog/log"
)

// RepositoryBase manages a registry of repository instances by their interface type.
type RepositoryBase struct {
	registry map[reflect.Type]interface{}
}

// NewBase creates a new RepositoryBase with an initialized registry map.
func NewBase() *RepositoryBase {
	log.Info().Msg("Initializing repository base")
	return &RepositoryBase{
		registry: make(map[reflect.Type]interface{}),
	}
}

// Init registers one or more repository implementations into the base registry.
func (f *RepositoryBase) Init(repo ...interface{}) {
	log.Info().Int("count", len(repo)).Msg("Registering repositories into base")
	f.registry = make(map[reflect.Type]interface{})
	for _, r := range repo {
		t := reflect.TypeOf(r)
		f.registry[t] = r
		log.Debug().Str("type", t.String()).Msg("Repository registered")
	}
}

// GetByType retrieves a registered repository by its interface type.
// It panics if no matching repository is found.
func GetByType[T any](f *RepositoryBase) T {
	targetType := reflect.TypeOf((*T)(nil)).Elem()
	log.Debug().Str("target_type", targetType.String()).Msg("Searching for repository implementation")

	for _, repo := range f.registry {
		if reflect.TypeOf(repo).Implements(targetType) {
			log.Info().Str("matched_type", reflect.TypeOf(repo).String()).Msg("Repository match found")
			return repo.(T)
		}
	}

	log.Fatal().Str("missing_type", targetType.String()).Msg("Repository not found, panicking")
	panic(fmt.Sprintf("repository of type %v not found", targetType))
}
