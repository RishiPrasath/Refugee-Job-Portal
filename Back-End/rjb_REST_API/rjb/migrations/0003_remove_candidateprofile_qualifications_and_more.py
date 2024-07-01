# Generated by Django 5.0.6 on 2024-07-01 18:04

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rjb', '0002_remove_candidateprofile_contact_email_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='candidateprofile',
            name='qualifications',
        ),
        migrations.RemoveField(
            model_name='candidateprofile',
            name='work_experience',
        ),
        migrations.AddField(
            model_name='candidateprofile',
            name='immigration_status',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='candidateprofile',
            name='profile_picture',
            field=models.ImageField(blank=True, null=True, upload_to='profile_pictures/'),
        ),
        migrations.RemoveField(
            model_name='candidateprofile',
            name='skills',
        ),
        migrations.CreateModel(
            name='CaseWorkerProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='rjb.user')),
            ],
        ),
        migrations.CreateModel(
            name='HiringCoordinatorProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=255)),
                ('contact_phone', models.CharField(blank=True, max_length=20, null=True)),
                ('date_of_birth', models.DateField(blank=True, null=True)),
                ('emergency_contact_name', models.CharField(blank=True, max_length=255, null=True)),
                ('emergency_contact_phone', models.CharField(blank=True, max_length=20, null=True)),
                ('linkedin_profile', models.URLField(blank=True, null=True)),
                ('github_profile', models.URLField(blank=True, null=True)),
                ('summary', models.TextField(blank=True, null=True)),
                ('accessibility_requirements', models.TextField(blank=True, null=True)),
                ('skills', models.ManyToManyField(blank=True, to='rjb.skill')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='rjb.user')),
            ],
        ),
        migrations.CreateModel(
            name='Qualification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('school', models.CharField(max_length=255)),
                ('qualification', models.CharField(max_length=255)),
                ('start_year', models.IntegerField()),
                ('end_year', models.IntegerField()),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rjb.candidateprofile')),
            ],
        ),
        migrations.CreateModel(
            name='WorkExperience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('company', models.CharField(max_length=255)),
                ('role', models.CharField(max_length=255)),
                ('start_year', models.IntegerField()),
                ('end_year', models.IntegerField()),
                ('description', models.TextField(blank=True, null=True)),
                ('candidate', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rjb.candidateprofile')),
                ('skills', models.ManyToManyField(blank=True, to='rjb.skill')),
            ],
        ),
        migrations.AddField(
            model_name='candidateprofile',
            name='skills',
            field=models.ManyToManyField(blank=True, to='rjb.skill'),
        ),
    ]
