from flask import Flask, render_template
from mongoengine import *


app = Flask(__name__)
connect('mongo_knuddy')

class User(Document):
	email = StringField()
	first_name = StringField()
	last_name = StringField()


@app.route('/')
@app.route('/index')
@app.route('/home')
def index():
	kwargs = {
		"page_title": "Index"
		}       
	return render_template("index.html", **kwargs)


@app.route('/sacred')
def upload():
	user = User(email="FAk3@gmail.com", first_name="Dean", last_name="Knudson")
	user.save()

	for u in User.objects:
    	print("{} {} : {}".format(u["first_name"], u["last_name"], u["email"]))
	
	return redirect(url_for('index'))
		


@app.route('/inspiration')
def inspiration():
	page_title = "Inspirations"
	return render_template("inspirations.html", page_title=page_title)

if __name__ =="__main__":
	app.run(debug=True, host='0.0.0.0', port=80)