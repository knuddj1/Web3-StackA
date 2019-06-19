import os
import pandas as pd
import json
from flask import Flask, render_template, redirect, url_for
from mongoengine import *

app = Flask(__name__)
app.config.from_object('config')
connect(app.config["DATABASE_NAME"])

class Country(EmbeddedDocument):
	country_name = StringField()
	payload = FloatField()

class Year(EmbeddedDocument):
	year = IntField()
	countries = ListField(EmbeddedDocumentField(Country))

class Dataset(Document):
	dataset_name = StringField()
	years = ListField(EmbeddedDocumentField(Year))

@app.route('/')
@app.route('/index')
@app.route('/home')
def index():
	page_title = "Index"
	return render_template("index.html", page_title=page_title)


@app.route('/inspiration')
def inspiration():
	page_title = "Inspirations"
	return render_template("inspirations.html", page_title=page_title)


@app.route('/read_data')
def read_data():
	Dataset.objects.delete()
	iters = zip(os.listdir(app.config['FILES_FOLDER']), app.config["DATASET_NAMES"])
	for fname, dname in iters:
		filename = os.fsdecode(fname)
		path = os.path.join(app.config['FILES_FOLDER'], filename)
		df = pd.read_csv(path).fillna(0)

		years = dict((key, Year(year=key)) for key in list(df)[1:])
		for _, row in df.iterrows():
			country_name = row['country']
			for k, v in list(row.iteritems())[1:]:
				country = Country(country_name=country_name, payload=v)
				years[k]["countries"].append(country)
		
		dataset = Dataset(dataset_name=dname)
		for year in years.values():
			dataset["years"].append(year)
		dataset.save()	
	return redirect("index")


@app.route('/get_dataset', methods=['GET'])
@app.route('/get_dataset/<string:dname>', methods=['GET'])
def get_dataset(dname=None):	
	if dname is None:
		return Dataset.objects.to_json()
	else:
		return Dataset.objects(dataset_name=dname).to_json()



@app.route('/data_list', methods=['GET'])
def get_dataset_names():
	return json.dumps(app.config["DATASET_NAMES"])


if __name__ =="__main__":
	app.run(debug=True, host='0.0.0.0', port=80)

