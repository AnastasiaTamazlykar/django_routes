__author__ = 'AnastasiaTamazlykar'
from mongoengine import Document,fields

class Route(Document):
   begin_point =  fields.PointField()
   end_point =  fields.PointField()
   begin_address = fields.StringField()
   end_address = fields.StringField()
