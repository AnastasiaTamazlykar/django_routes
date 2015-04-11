import os
from mongoengine import connect,register_connection
BASE_DIR = os.path.dirname(os.path.dirname(__file__))

SECRET_KEY = ''


DEBUG = True
THUMBNAIL_DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []

# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'djangotoolbox',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.humanize',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'routes_django.urls'

WSGI_APPLICATION = 'routes_django.wsgi.application'



DATABASES = {
    'default': {
        'ENGINE': 'django_mongodb_engine',
        'NAME': 'db_routes',
        'HOST': 'localhost',
        'PORT': '27025',
        },
}

connect('db_routes', host='localhost', port=27025)

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

# USE_TZ = True

REGISTRATION_OPEN=True

STATICFILES_DIRS = (BASE_DIR+'/static/',
)

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
)
STATIC_URL = '/static/'
MEDIA_URL = '/media/'
TEMPLATE_DIRS = (os.path.join(BASE_DIR, 'templates'))
