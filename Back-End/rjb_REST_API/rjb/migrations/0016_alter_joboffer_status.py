# Generated by Django 5.0.6 on 2024-08-06 16:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rjb', '0015_joboffer_application'),
    ]

    operations = [
        migrations.AlterField(
            model_name='joboffer',
            name='status',
            field=models.CharField(default='Pending', max_length=50),
        ),
    ]
