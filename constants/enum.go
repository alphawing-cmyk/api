package constants

type ServiceEnum string

const (
	CLIENT  ServiceEnum = "SERVICE"
	ADMIN   ServiceEnum = "USER"
	DEMO    ServiceEnum = "ADMIN"
	SERVICE ServiceEnum = "SERVICE"
)

var AllRoles = []ServiceEnum{
	ServiceEnum("ADMIN"),
	ServiceEnum("SERVICE"),
	ServiceEnum("DEMO"),
}
