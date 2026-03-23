import gridfs
# ===== IMPORT LIBRARIES =====
from flask import Flask,request,jsonify
from flask_cors import CORS
from pymongo import MongoClient
from resume_parser import parse_resume
from ranking_model import rank_candidates
import os
from resume_parser import parse_resume, extract_name, extract_email
from skill_extractor import extract_skills
# ===== CREATE FLASK APP =====
app=Flask(__name__)
CORS(app)

from flask import Flask, send_from_directory
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")

app = Flask(__name__, static_folder=FRONTEND_DIR)

# ===== UPLOAD FOLDER SETUP =====
BASE_DIR=os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER=os.path.join(BASE_DIR,"uploads")
os.makedirs(UPLOAD_FOLDER,exist_ok=True)

# ===== MONGODB ATLAS CONNECTION =====
import os
from pymongo import MongoClient

client = MongoClient(os.environ.get("MONGO_URI"))
db=client["resume_screening_system"]
users_collection=db["users"]

# ===== CANDIDATES COLLECTION =====
candidates_collection=db["candidates"]

# ===== GRIDFS FILE STORAGE =====
fs = gridfs.GridFS(db)


# ===== USER SIGNUP API =====
@app.route("/signup",methods=["POST"])
def signup():
    data=request.json
    name=data["name"]
    email=data["email"]
    password=data["password"]
    existing_user=users_collection.find_one({"email":email})
    if existing_user:
        return jsonify({"message":"User already exists"})
    users_collection.insert_one({
        "name":name,
        "email":email,
        "password":password
    })
    return jsonify({"message":"Signup successful"})

# ===== USER LOGIN API =====
@app.route("/login",methods=["POST"])
def login():
    data=request.json
    email=data["email"]
    password=data["password"]
    user=users_collection.find_one({"email":email})
    if not user:
        return jsonify({"message":"User not found"})
    if user["password"]!=password:
        return jsonify({"message":"Invalid password"})
    return jsonify({
        "message":"Login successful",
        "name":user["name"]
    })

# ===== ALLOWED FILE TYPES =====
ALLOWED_EXTENSIONS={"pdf","docx","txt"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".",1)[1].lower() in ALLOWED_EXTENSIONS

# ===== RESUME UPLOAD API =====
@app.route("/upload-resumes",methods=["POST"])
def upload_resumes():
    print("Using DB:", db.name)
    files=request.files.getlist("resumes")
    print("FILES RECEIVED:",files)
    stored_files=[]
    for file in files:
        if file.filename=="":
            continue
        if not allowed_file(file.filename):
            return jsonify({"message":"Only PDF, DOCX, TXT allowed"}),400
        file_id = fs.put(file.read(), filename=file.filename)
        print("Stored in GridFS:",file.filename)
        stored_files.append(str(file_id))
    return jsonify({
        "message":"Resumes stored in MongoDB",
        "files":stored_files
    })

# ===== RESUME SCREENING API =====
# ===== RESUME SCREENING API =====
@app.route("/screen",methods=["POST"])
def screen_resumes():
    job_description=request.form["job"]
    files=request.files.getlist("resumes")
    resume_texts=[]
    for file in files:
        print("FILES RECEIVED:",file.filename)
        file_data=file.read()
        # store resume in GridFS
        file_id=fs.put(file_data,filename=file.filename)
        file_path=os.path.join(UPLOAD_FOLDER,file.filename)
        with open(file_path,"wb") as f:
            f.write(file_data)
        text=parse_resume(file_path)
        resume_texts.append(text)
    results=rank_candidates(job_description,resume_texts)
    for i,text in enumerate(resume_texts):
        name=extract_name(text)
        email=extract_email(text)
        skills=extract_skills(text)
        candidates_collection.insert_one({
            "name":name,
            "email":email,
            "skills":skills,
            "score":results[i]
        })
    return jsonify(results)

# ===== TEST CANDIDATE INSERT =====
@app.route("/test-insert")
def test_insert():
    candidates_collection.insert_one({
        "name":"Test User",
        "email":"test@example.com",
        "skills":["python","ml"]
    })
    return "Candidate inserted"

# ===== GET CANDIDATES API =====
@app.route("/candidates",methods=["GET"])
def get_candidates():
    candidates=list(candidates_collection.find({},{"_id":0}).sort("score",-1))
    return jsonify(candidates)

# ===== DELETE SINGLE CANDIDATE =====
@app.route("/delete-candidate/<email>",methods=["DELETE"])
def delete_candidate(email):
    candidates_collection.delete_one({"email":email})
    return jsonify({"message":"Candidate deleted"})


# ===== DELETE ALL CANDIDATES =====
@app.route("/delete-all-candidates",methods=["DELETE"])
def delete_all_candidates():
    candidates_collection.delete_many({})
    return jsonify({"message":"All candidates deleted"})


@app.route("/")
def home():
    return send_from_directory(FRONTEND_DIR, "dashboard.html")

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(FRONTEND_DIR, path)

from flask import send_from_directory


# ===== RUN SERVER =====
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)



