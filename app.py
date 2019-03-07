from flask import Flask, render_template
app = Flask(__name__)

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

if __name__ =="__main__":
    app.run(debug=True,port=8080)