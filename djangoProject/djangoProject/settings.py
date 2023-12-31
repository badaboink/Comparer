"""
Django settings for djangoProject project.

Generated by 'django-admin startproject' using Django 4.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-_&%(ckjj^6#w=gfxqbp6ov5qrj&knqq1r2ll3#+m2367^!m62k'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'comparer'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'comparer.customs.custom_404_middleware.Custom404Middleware',
]

ROOT_URLCONF = 'djangoProject.urls'

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',
    'https://yellow-bush-0d2295f03.4.azurestaticapps.net'
]
CSRF_COOKIE_SAMESITE = 'None'
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://yellow-bush-0d2295f03.4.azurestaticapps.net"
]
CORS_ORIGIN_WHITELIST = [
    'http://localhost:3000',
    "http://127.0.0.1:3000",
    'https://yellow-bush-0d2295f03.4.azurestaticapps.net'
]
CSRF_ORIGINS = [
    'http://localhost:3000',
    "http://127.0.0.1:3000",
    'https://yellow-bush-0d2295f03.4.azurestaticapps.net'
]
CSRF_ALLOWED = [
    'http://localhost:3000',
    "http://127.0.0.1:3000",
    'https://yellow-bush-0d2295f03.4.azurestaticapps.net'
]
CORS_ALLOW_CREDENTIALS = True
SESSION_COOKIE_SAMESITE = None

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates']
        ,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ],
}

handler404 = 'comparer.custom_exception_handler.custom_404_view'

WSGI_APPLICATION = 'djangoProject.wsgi.application'
# APPEND_SLASH = False

# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES = {
    # 'default': {
    #     'ENGINE': 'mssql',  # Use the SQL Server backend.
    #     'HOST': 'comparer.database.windows.net',  # Azure SQL Database server hostname
    #     'PORT': '',  # Leave empty or specify if necessary
    #     'NAME': 'comparer',  # Your Azure SQL Database name
    #     'USER': 'eglej',  # Your Azure SQL Database username
    #     'PASSWORD': '',  # Your Azure SQL Database password
    #     'OPTIONS': {
    #         'driver': 'ODBC Driver 17 for SQL Server',  # The ODBC driver to use
    #     },
    # }
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'USER': 'root',
        'PASSWORD': '',
        'NAME': 'comparer',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

SIMPLE_JWT = {
    'AUTH_HEADER_TYPES': ('JWT',),
}

DROPBOX_APP_KEY = 'h5icq9e30mtr3rz'
DROPBOX_APP_SECRET = 'r4l2c16ggrwvaso'
DROPBOX_OAUTH2_REFRESH_TOKEN = '8z2k7Y40F0EAAAAAAAAAAeedQHjrdZ2ftG5H55lnQxlLyZwg-AAOkbR4MiiG_aQi'
DROPBOX_ROOT_PATH = "/"

DROPBOX_OAUTH2_TOKEN = 'sl.Bq6LL6ujjEhBqFBSfBHLseEbZ3E2zqu5pH33S6XYQbUThjm9pWHYVV2Ryv6UoHisDHZOADuDZXcs49_CmAK177CSdJV_J_SeppKcevuEQ_ZNDPBFwVR4cufo2ZTBJclY8ZpUtz7QvgieCEHCqVPVUDI'

STORAGES = {
    "default": {
        "BACKEND": "storages.backends.dropbox.DropBoxStorage",
        "OPTIONS": {

        },
    },
}
# DROPBOX_OAUTH2_TOKEN = 'sl.Bq6LL6ujjEhBqFBSfBHLseEbZ3E2zqu5pH33S6XYQbUThjm9pWHYVV2Ryv6UoHisDHZOADuDZXcs49_CmAK177CSdJV_J_SeppKcevuEQ_ZNDPBFwVR4cufo2ZTBJclY8ZpUtz7QvgieCEHCqVPVUDI'
# DROPBOX_ACCESS_TOKEN = 'qPmi8osOIkMAAAAAAAABJy4P-Dcpql_mNNAzh3ZcNu4'

