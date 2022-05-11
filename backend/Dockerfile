FROM python:3

WORKDIR /code

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_APP=showroom.py
ENV FLASK_ENV=development

CMD flask run --host=0.0.0.0 --port=5000
