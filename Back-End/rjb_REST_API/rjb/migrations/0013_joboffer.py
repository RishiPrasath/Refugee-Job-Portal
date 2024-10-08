# Generated by Django 5.0.6 on 2024-07-27 18:26

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rjb', '0012_remove_interview_interviewer_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='JobOffer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('job_offer_document', models.FileField(blank=True, null=True, upload_to='job_offers/')),
                ('additional_details', models.TextField(blank=True, null=True)),
                ('offer_datetime', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(default='pending', max_length=50)),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rjb.candidateprofile')),
                ('employer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rjb.employerprofile')),
                ('job_posting', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rjb.jobposting')),
            ],
        ),
    ]
