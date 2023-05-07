#!/bin/sh
./front.sh &
python3 ./restify/manage.py runserver
