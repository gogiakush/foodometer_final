# Generated by Django 3.0.7 on 2020-08-01 17:19

from django.db import migrations, models
import django.db.models.query


class Migration(migrations.Migration):

    dependencies = [
        ('foodom', '0002_auto_20200801_0541'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='meals',
            field=models.ManyToManyField(default=django.db.models.query.EmptyQuerySet, related_name='Eater', to='foodom.Food'),
        ),
    ]
