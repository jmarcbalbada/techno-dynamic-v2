# Generated by Django 5.0.6 on 2024-10-15 05:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='lessoncontent',
            options={'ordering': ['id']},
        ),
        migrations.AlterField(
            model_name='contenthistory',
            name='lessonId',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='lesson_id', to='api.lesson'),
        ),
    ]
