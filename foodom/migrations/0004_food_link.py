# Generated by Django 3.0.7 on 2020-08-02 04:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('foodom', '0003_auto_20200801_1719'),
    ]

    operations = [
        migrations.AddField(
            model_name='food',
            name='link',
            field=models.TextField(default=''),
        ),
    ]
