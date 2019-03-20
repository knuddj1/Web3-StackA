import os
import pandas as pd
from flask import Flask, render_template, redirect, url_for
from mongoengine import *


app = Flask(__name__)
connect('mongo_knuddy')

class Country(Document):
	country_name = StringField()

class Year(Document):
	year = IntField()

class Data(Document):
	country_id = IntField()
	year_id = IntField()
	filename = StringField()
	payload = FloatField()


@app.route('/')
@app.route('/index')
@app.route('/home')
def index():
	kwargs = {
		"page_title": "Index"
		}
	return render_template("index.html", **kwargs)


@app.route('/inspiration')
def inspiration():
	page_title = "Inspirations"
	return render_template("inspirations.html", page_title=page_title)


def check_countries(lst):
	for c in lst:
		if len(Country.objects(country_name=c)) is 0:
			Country(country_name=c).save()

@app.route('/read_data')
def read_data():
	for file in os.listdir(app.config['FILES_FOLDER']):
		filename = os.fsdecode(file)
		path = os.path.join(app.config['FILES_FOLDER'], filename)
		df = pd.read_csv(path)
		country_key = list(df)[0]
		for country in df[country_key]:
			query = df.loc[df[country_key] == "New Zealand"]

    		query.to_dict(orient='list'))
		


@app.route('/update/<string:country_name>', methods=['PUT'])
def update_country(country_name):
	pass

@app.route('/create/<string:country_name>', methods=['POST'])
def create_country(country_name):
	pass


@app.route('/country', methods=['GET'])
@app.route('/country/<int:country_id>', methods=['GET'])
def get_country(country_id=None):
	countries = Country.objects
	return countries.to_json()


if __name__ =="__main__":
	app.run(debug=True, host='0.0.0.0', port=80)
	app.config.from_object('config')