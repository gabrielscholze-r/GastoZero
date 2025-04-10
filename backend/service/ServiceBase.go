package service

import (
	"fmt"
	"reflect"
)

type ServiceBase struct {
	registry map[reflect.Type]interface{}
}

func NewBase() *ServiceBase {
	return &ServiceBase{
		registry: make(map[reflect.Type]interface{}),
	}
}

func (f *ServiceBase) Init(repo ...interface{}) {
	f.registry = make(map[reflect.Type]interface{})
	for _, repo := range repo {
		t := reflect.TypeOf(repo).Elem()
		f.registry[t] = repo
	}
}

func GetByType[T any](f *ServiceBase) T {
	targetType := reflect.TypeOf((*T)(nil)).Elem()

	for _, repo := range f.registry {
		if reflect.TypeOf(repo).Implements(targetType) {
			return repo.(T)
		}
	}

	panic(fmt.Sprintf("service of type %v not found", targetType))
}
