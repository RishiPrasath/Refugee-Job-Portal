# Generated by Django 5.0.6 on 2024-07-28 16:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rjb', '0014_alter_joboffer_job_offer_document'),
    ]

    operations = [
        migrations.AddField(
            model_name='joboffer',
            name='application',
            field=models.ForeignKey(default=2, on_delete=django.db.models.deletion.CASCADE, to='rjb.application'),
            preserve_default=False,
        ),
    ]
