# Kitchen Service

A miniature food delivery service API written with Express,
Typescript, TypeORM and PostgreSQL.

## Getting Started

This application is hosted on [Render](https://kitchen-service-fb84.onrender.com)\
And a documentation is available on [Postman](https://documenter.getpostman.com/view/11142088/2sA3dsnuKk)

You can run this application any of three ways, depending on your available
resources and setup.

1. Run with Docker alone
2. Run with Node.js, npm and a PostgreSQL instance on Docker
3. Run with Node.js, npm and a PostgreSQL instance on your local machine

Each of the following will be explained.

## Running with Docker

This is the easiest and most straightfoward way as all you need is
Docker. There is a `docker-compose.yaml` and a `Dockerfile` already
setup to build and run.

### Requirements

- Docker running on your local machine

### Steps

Build the Docker image\
`docker-compose build`

Run the Docker container\
`docker-compose up`

Visit [localhost:3000](http://localhost:3000)

## Running with Node.js and Docker

This will be more suited if you already have Node.js and npm
but don't have PostgreSQL installed. You can run a PosgreSQL
instance on Docker instead.

### Requirements

- Node.js
- npm
- Docker running on your local machine

### Steps

Create a file named `.env` in the root directory that will
store environment variables.

Open `.env.example` and copy the keys labeled #2 into the `.env`.
These will serve as mock environment variables, so you will
have to provide any missing keys.

Run the PostgreSQL Docker image provided in the project by entering\
`docker-compose up postgres -d`\
This starts up a PostgreSQL instance on Docker and persists the
data in an allocated Docker volume.

Install the Node modules the project is dependent on by entering\
`npm install`

Compile the Typescript files into Javascript by entering\
`npm run build`

Start the server on your local machine by entering\
`npm start`

Visit [localhost:3000](http://localhost:3000)

## Running with Node.js and PostgreSQL

This procedure runs all dependent resources on your local
machine without the need for a virtual machine.

### Requirements

- Node.js
- npm
- PostgreSQL running on your local machine

### Steps

Create a PostgreSQL database you intend to use for this application.

Create a file named `.env` in the root directory that will
store environment variables.

Open `.env.example` and copy the keys labeled #1 into the `.env`.
These will serve as dummy environment variables, so you will
have to provide any missing keys, including the credentials to
access your already created PostgreSQL database.

Install the Node modules the project is dependent on by entering\
`npm install`

Compile the Typescript files into Javascript by entering\
`npm run build`

Start the server on your local machine by entering\
`npm start`

Visit [localhost:3000](http://localhost:3000)

## Testing

For testing, this application makes use of `jest`, a well
known npm package with lots of features. For integration testing,
`supertest` is used.

To run unit tests, enter the following command\
`npm test`

To run integration tests, enter the following command\
`npm test:e2e`

## Documentation

This is a brief explanation of the programming aspect of this
application.

### Overview

This application was built with Node.js, Express, Typescript,
and PostgreSQL. It is a miniature food delivery service that provides
a REST API for user interaction. The resources are separated into directories
called modules, along with two other directories, one for commonly used code
and the other for middleware.

The express app is abstracted into a class called `ExpressApp`,
which is responsible for starting the app, connecting to the database,
instantiating all classes in the project and injecting their dependencies,
connecting the middleware and routers to the app, and starting the server on a
specified port. The class is imported in the entry file `server.ts`
responsible for instantiating and running the app.

In each directory containing a REST resource, there is a file `index.ts`
that exports a function which accepts dependencies and instantiates
the services and controllers in that directory. This approach, along
with the `ExpressApp` class, make the application very loosely coupled
and allows for easy swapping of dependencies or database configuration
as needed. One area that greatly benefits from this is integration testing.

### Errors

For errors, this application defines a base error class intuitively named
`BaseError`. It provides a barebones strucure for all errors returned to the
user. It includes a message, status code, timestamp and path.

Two error classes inherit from this base error class; `HttpError` and
`ValidationError`. `HttpError` represents a generic HTTP error
and its only addition to the base class is that it logs the error to
the console before propagating, while `ValidationError` represents bad
input from the user and contains an additional array to store the error
messages, aiding the user to know what was wrong with the input.

There is another error class called `ConfigException`. This class does not
inherit from `BaseError` because it has nothing to do with the user, and it
is more for exceptions than errors, in the sense that it is not supposed
to be recovered from. It represents exceptions that arise from configuration
problems, and require the developer to fix them.

### Logging

There is a `Logger` class available that handles logging, it can log info
or errors, both of which are prefixed with a timestamp and some coloring to tell
them apart easily.

### Middleware

Five middleware functions exist in this application

1. Authorization Middleware handles authorization for each request. It
   expects a valid JWT token in the `Authorization` header, prefixed with
   `"Bearer "`. If any of these conditions fail, a `401` response is sent

2. Error Logger Middleware logs errors before they are returned

3. Error Handler Middleware sends errors to the users in a neat consistent
   format, with appropriate status codes

4. Invalid Path Handler Middleware responds when a request is made to
   a path not registered to any controller

5. Request Logger Middleware logs every incoming request with useful
   information

A middleware class for permissions, namely `PermissionsMiddlware` exists,
it provides two methods, one being `isVendor()`, which checks if the current
logged in user is a vendor, the other being `ownsVendorAccount`, which checks
if the current logged in user owns the Vendor account that is required to make
a certain request.

### DTOs

The endpoints in this application expect and return different data shapes,
the DTOs handle this using ES6 classes to represent the various shapes, each
with its own function to build it using expected arguments. This reduces
repetition as the class is only instantiated in one place.

Request data usually requires validation, and for that, npm package
`class-validator` is used to ensure request data is valid. In the event that
it is not, a `RequestValidationError` is thrown.

### Auth Module

This module provides controllers, services and DTOs to handle registering and
logging in both vendors and customers.

### Menu Items Module

This module provides controller, services, DTOs and models for creating, updating
and fetching menu items.

### Users Module

This module provides controllers and services to fetch the
current authenticated user.

### Common

This directory contains DTOs, errors, interfaces, encryption methods,
helper methods and the logging class.

The function `getEnvironmentVariable` helps get environment variables and
can additionally ensure they are the correct type by optionally accepting
a validator function and running it against the returned value. If the
variable isn't set or if it is set and is of the wrong type, a `ConfigException`
will be thrown as it up to the developer to fix that.

### Tests

Tests are written with `Jest` and `Supertest`, and they include unit tests of the
service methods, which are very barebones and mock out all dependencies, and
integration tests that consume the resources like an end user would.

Notice that for integration tests, the `ExpressApp` is used along with a SQLite
datasource that is generated on the fly for each test. This allows the tests use
a real database without populating your main database. A SQLite3 database is
created before each test case and is dropped afterwards, ensuring every single
test case runs in isolation, and not having to worry about shared states or which
test ends first. It is for this reason that the command for integration tests is
different, as it forces tests to run serially, unlike the unit tests that make more
sense running concurrently.

## Questions you might have for me
Just a few things that might be odd or need questioning

- Why I used a different table for vendors and customers
- Why I chose a user-type over boolean
- Why my app is stuctured this way
- Why I use DTOs like this
- Why I use middleware like this
- Why I use the Express App abstraction
- Why I used numbers for ID, as opposed to UUID
- Why I use mocks in my unit tests
- Why I used the createModule approach
- Why I have functions to build each DTO
- Why I use global types
- Why I use data source in some constructors
- Why no database migrations
- Why some create service methods in unit tests aren't mocked
- Why I used database transactions