import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # Change the secret key in production run.
    SECRET_KEY = os.environ.get("SECRET_KEY", os.urandom(24))
    DEBUG = False

    # JWT Extended config
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", os.urandom(24))
    ## Set the token to expire every week
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    JWT_TOKEN_LOCATION = ["headers", "cookies"]
    # JWT_COOKIE_DOMAIN = "127.0.0.1"

    S3_BUCKET = "imagesshowroom"
    S3_KEY = os.environ.get("AWS_KEY_ID")
    S3_SECRET = os.environ.get("AWS_KEY")
    S3_LOCATION = 'http://{}.s3.amazonaws.com/'.format(S3_BUCKET)


class DevelopmentConfig(Config):
    DEBUG = True
    db_password = os.getenv("POSTGRES_PASSWORD")
    db_user = os.getenv("POSTGRES_USER")
    db_name = os.getenv("POSTGRES_DB")
    SQLALCHEMY_DATABASE_URI = f'postgresql://{db_user}:{db_password}@postgres:5432/{db_name}'

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Add logger
class TestingConfig(Config):
    DEBUG = True
    TESTING = True
    # In-memory SQLite for testing
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False


class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", "sqlite:///" + os.path.join(basedir, "data.sqlite")
    ).replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False


config_by_name = dict(
    development=DevelopmentConfig,
    testing=TestingConfig,
    production=ProductionConfig,
    default=DevelopmentConfig,
)
