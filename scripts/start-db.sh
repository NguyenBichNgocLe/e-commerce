#!/bin/bash

docker run --name mysql -e MYSQL_DATABASE=my-db -e MYSQL_ROOT_PASSWORD='Password0.' -p 3306:3306 -d mysql