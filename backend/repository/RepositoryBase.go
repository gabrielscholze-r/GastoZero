package repository

import (
	"fmt"
	"reflect"
)

type RepositoryBase struct {
	registry map[reflect.Type]interface{}
}

func NewBase() *RepositoryBase {
	return &RepositoryBase{
		registry: make(map[reflect.Type]interface{}),
	}
}

func (f *RepositoryBase) Init(repo ...interface{}) {
	f.registry = make(map[reflect.Type]interface{})
	for _, repo := range repo {
		t := reflect.TypeOf(repo)
		f.registry[t] = repo
	}
}

func GetByType[T any](f *RepositoryBase) T {
	targetType := reflect.TypeOf((*T)(nil)).Elem()

	for _, repo := range f.registry {
		if reflect.TypeOf(repo).Implements(targetType) {
			return repo.(T)
		}
	}

	panic(fmt.Sprintf("repository of type %v not found", targetType))
}
