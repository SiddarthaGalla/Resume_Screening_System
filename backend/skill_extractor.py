# ===== IMPORT NLP LIBRARY =====
import spacy

# ===== LOAD NLP MODEL =====
nlp=spacy.load("en_core_web_sm")

# ===== SKILL DATABASE =====
skills_db=[
"python","java","machine learning","deep learning","nlp",
"tensorflow","pytorch","sql","aws","docker","kubernetes",
"data analysis","pandas","numpy","flask","django",
"spring","react","nodejs","statistics","cloud computing"
]

# ===== SKILL EXTRACTION FUNCTION =====
# ===== SKILL EXTRACTION =====

skills_list=[
"python","java","c++","machine learning","deep learning",
"data science","sql","mongodb","flask","django",
"aws","azure","nlp","tensorflow","pytorch",
"react","javascript","html","css"
]

def extract_skills(text):

    text=text.lower()

    found_skills=[]

    for skill in skills_list:
        if skill in text:
            found_skills.append(skill)

    return found_skills