import os
import pandas as pd
from flask import Flask, render_template, redirect, url_for
from mongoengine import *


app = Flask(__name__)
connect('mongo_knuddy')

class Data(EmbeddedDocument):
	year = IntField()
	payload = FloatField()

class Country(Document):
	country_name = StringField()
	cell_data = ListField(EmbeddedDocumentField(Data))
	internet_users = ListField(EmbeddedDocumentField(Data))
	sugar_data = ListField(EmbeddedDocumentField(Data))


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


def get_country_obj(country_name):
	country_obj = Country.objects(country_name=country_name).first()
	if country_obj is None:
		country_obj = Country(country_name=country_name)
		country_obj.save()
	return country_obj


@app.route('/read_data')
def read_data():
	app.config.from_object('config')
	iters = zip(os.listdir(app.config['FILES_FOLDER']),["cell_data", "internet_users", "sugar_data"])
	for file, list_field in iters:
		filename = os.fsdecode(file)
		path = os.path.join(app.config['FILES_FOLDER'], filename)
		df = pd.read_csv(path) # .fillna(None)

		for country in df["country"]:
			country_obj = get_country_obj(country)
			query = df.loc[df["country"] == country]
			query = query.to_dict(orient='list')
			for year in list(df)[1:]:
				payload = query[year][0]
				d = Data(year = int(year), payload = float(payload))
				country_obj[list_field].append(d)
			country_obj.save()



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