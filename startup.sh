#!/bin/sh
chmod u+r+x startup.sh
chmod u+r+x restify/manage.py
sed -i -e 's/\r$//' run.sh
sed -i -e 's/\r$//' front.sh
chmod u+r+x run.sh
chmod u+r+x front.sh
python3 -m pip install virtualenv
python3 -m virtualenv venv
source "venv/bin/activate"
python -m pip install django
pip install -r requirements.txt
python3 ./restify/manage.py makemigrations
python3 ./restify/manage.py migrate
sudo apt install nodejs
npm install react-datepicker
npm install react-scripts
npm install react-router-dom
npm install react-bootstrap
npm install
npm install react-dates --force
