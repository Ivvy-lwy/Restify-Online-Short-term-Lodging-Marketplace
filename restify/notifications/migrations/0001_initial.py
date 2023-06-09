# Generated by Django 4.1 on 2023-04-23 17:36

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('RATING', 'Rating'), ('COMMENT', 'Comment'), ('RESERVATION_REQUEST', 'Reservation Request'), ('RESERVATION_APPROVAL', 'Reservation Approval'), ('RESERVATION_CANCELLATION', 'Reservation Cancellation'), ('RESERVATION_DENIAL', 'Reservation Denial'), ('UPCOMING_RESERVATION', 'Upcoming Reservation'), ('CANCELING_APPROVAL', 'Canceling Approval'), ('CANCELING_DENIAL', 'Canceling Denial'), ('RESERVATION_TERMINATION', 'Reservation Termination')], max_length=50)),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('is_read', models.BooleanField(default=False)),
                ('message', models.CharField(blank=True, max_length=200, null=True)),
                ('receiver', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notification_receiver', to=settings.AUTH_USER_MODEL)),
                ('sender', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notification_sender', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
