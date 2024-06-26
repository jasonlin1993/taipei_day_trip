from flask import *
from api.attractions_api import attractions_api
from api.attraction_id_api import attraction_id_api
from api.mrt_api import mrt_api
from api.user_api import user_api
from api.user_auth_api import user_auth_api
from api.booking_api import booking_api
from api.order_api import order_api
from api.order_id_api import order_id_api
from data.database import pool



app = Flask(
    __name__,
    static_folder='static',
    static_url_path='/'
)


app.json.ensure_ascii = False
app.config["TEMPLATES_AUTO_RELOAD"]=True


# Pages
@app.route("/")
def index():
	return render_template("index.html")
@app.route("/attraction/<id>")
def attraction(id):
	return render_template("attraction.html")
@app.route("/booking")
def booking():
	return render_template("booking.html")
@app.route("/thankyou")
def thankyou():
	return render_template("thankyou.html")



app.register_blueprint(attractions_api)
app.register_blueprint(attraction_id_api)
app.register_blueprint(mrt_api)
app.register_blueprint(user_api)
app.register_blueprint(user_auth_api)
app.register_blueprint(booking_api)
app.register_blueprint(order_api)
app.register_blueprint(order_id_api)
app.run(host="0.0.0.0", port=3000)