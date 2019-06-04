import os
import pandas as pd
import json
from flask import Flask, render_template, redirect, url_for
from mongoengine import *

app = Flask(__name__)
app.config.from_object('config')
connect(app.config["DATABASE_NAME"])

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
	Country.objects.delete()

	iters = zip(os.listdir(app.config['FILES_FOLDER']), app.config["DATASET_NAMES"])

	for fname, list_field in iters:
		filename = os.fsdecode(fname)
		path = os.path.join(app.config['FILES_FOLDER'], filename)
		df = pd.read_csv(path).fillna(-1)

		for country in df["country"]:
			country_obj = get_country_obj(country)
			query = df.loc[df["country"] == country]
			query = query.to_dict(orient='list')
			for year in list(df)[1:]:
				payload = query[year][0]
				d = Data(year = int(year), payload = float(payload))
				country_obj[list_field].append(d)
			country_obj.save()
	return redirect("index")


@app.route('/country', methods=['GET'])
@app.route('/country/<string:country_name>', methods=['GET'])
def get_country(country_name=None):	
	if country_name is None:
		return Country.objects.to_json()
	else:
		return Country.objects(country_name=country_name).to_json()


@app.route('/countries_list', methods=['GET'])
def get_countries_list():	
	return Country.objects.values_list("country_name").to_json()

@app.route('/data_list', methods=['GET'])
def get_dataset_names():
	return json.dumps(app.config["DATASET_NAMES"])


if __name__ =="__main__":
	app.run(debug=True, host='0.0.0.0', port=80)

