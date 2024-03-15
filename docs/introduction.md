# Introduction

Kitbag Mapper was built to provide structure around a very common problem in every Typescript project, mapping between types. Sometimes that mapping is simply going from one primitive to another, like standardizing how we get from `string` to `Date`, or `number` to a USD formatted `string`. It could also be mapping a server model to a frontend model and is as simple as converting snake_cased properties like `first_name` to camelCased properties like `firstName`.
