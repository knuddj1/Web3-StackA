from flask import Flask, render_template, redirect, url_for
from mongoengine import *


app = Flask(__name__)
connect('mongo_knuddy')

class Country(Document):
	country_code = StringField()
	country_name = StringField()


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


@app.route('/read_data')
def read_data():
	import os
	app.config.from_object('config')
	for file in os.listdir(app.config['FILES_FOLDER']):
		filename = os.fsdecode(file)
		path = os.path.join(app.config['FILES_FOLDER'], filename)
		f = open(path)
		r = csv.reader(f)
		d = list(r)
		for data in d:
			print(data)

@app.route('/create/<string:country_name>', methods=['POST'])
def create_country(country_name):
	choices = []

	country = Country(country_name=country_name)
	country.save()
	redirect(url_for(get_country(country_id=country.id)))


@app.route('/country', methods=['GET'])
@app.route('/country/<int:country_id>', methods=['GET'])
def get_country(country_id=None):
	if country_id is None:
		countries = Country.objects
	else:
		try:
			countries = Country.objects.get(id=country_id)
		except ValueError:
			return "No countries with that id found"
	return countries.to_json()


if __name__ =="__main__":
	app.run(debug=True, host='0.0.0.0', port=80)