@echo off
echo Running Django migrations...
:: Run makemigrations
echo Making migrations...
python manage.py makemigrations
:: Run migrate
echo Applying migrations...
python manage.py migrate
echo Migrations completed.
pause