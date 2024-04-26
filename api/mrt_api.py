from flask import Blueprint, jsonify
from model.mrt_model import fetch_all_mrts

mrt_api = Blueprint('mrt_api', __name__)

@mrt_api.route("/api/mrts", methods=["GET"])
def get_mrt():
    try:
        mrts = fetch_all_mrts()
        return jsonify({"data": mrts})
    except Exception as e:
        print(e)
        return jsonify({"error": True, "message": "伺服器內部錯誤"}), 500
