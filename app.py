from flask import Flask, render_template, redirect, url_for
from mongoengine import *


app = Flask(__name__)
connect('mongo_knuddy')

class Country(Document):
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


@app.route('/create/<string:country_name>', methods=['POST'])
def create_country(country_name):
	country = Country(country_name=country_name)
	country.save()
	redirect(url_for(get_country(country_id=country.id)))


@app.route('/country', methods=['GET'])
@app.route('/country/<int:country_id>', methods=['GET'])
def get_country(country_id=None):
	if country_id is None:
		countries = Country.objects
	else:
		countries = Country.objects.get(id=country_id)
	return countries.to_json()


if __name__ =="__main__":
	app.run(debug=True, host='0.0.0.0', port=80)