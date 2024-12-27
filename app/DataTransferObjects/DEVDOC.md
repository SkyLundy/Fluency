# Fluency Data Transfer Objects

Data transfer objects are immutable objects created from stored data, passed to requests, or returned from a method. In some instances arrays of data transfer objects may be returned.

DTOs should always be created using the FluencyDTO::fromArray() method which performs some
data validation, creates additional properties for the object, and returns a new instantiation of
itself. Often, the additional properties that are created in FluencyDTO::fromArray() are
required by other operations and creating a DTO using the constructor directly may create issues.