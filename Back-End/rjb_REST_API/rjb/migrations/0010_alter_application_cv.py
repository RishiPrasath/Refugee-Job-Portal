# Generated by Django 5.0.6 on 2024-07-15 19:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rjb', '0009_candidatesavesjobposting'),
    ]

    operations = [
        migrations.AlterField(
            model_name='application',
            name='cv',
            field=models.FileField(blank=True, null=True, upload_to='cvs/'),
        ),
    ]
