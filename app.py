from flask import Flask, render_template
from mongoengine import *


app = Flask(__name__)
connect('mongo_knuddy')

class User(Document):
    username = StringField()
    email = StringField()
    password = StringField()
    confirm = PasswordField('Repeat Password')


dean = User(email="FAk3@gmail.com", first_name="Dean", last_name="Knudson")

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

    for user in User.objects:
        print(user)

    return render_template("inspirations.html", page_title=page_title)

if __name__ =="__main__":
    app.run(debug=True, port=80)