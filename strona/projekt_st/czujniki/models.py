from django.db import models

class Data(models.Model):
    id = models.AutoField(primary_key=True)
    temperature = models.FloatField()
    humidity = models.FloatField()
    date = models.DateTimeField()

    def __str__(self):
        return f"ID: {self.id}, Temperature: {self.temperature}, Humidity: {self.humidity}, Date: {self.date}"

    class Meta:
        db_table = 'data'


class Motion(models.Model):
    id = models.AutoField(primary_key=True)
    motion = models.IntegerField()
    date = models.DateTimeField()

    def __str__(self):
        return f"ID: {self.id}, Motion: {self.motion}, Date: {self.date}"

    class Meta:
        db_table = 'motion'