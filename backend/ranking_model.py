# ===== IMPORT LIBRARIES =====
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ===== RANK CANDIDATES =====
def rank_candidates(job_description,resume_texts):

    documents=[job_description]+resume_texts

    vectorizer=TfidfVectorizer()

    tfidf_matrix=vectorizer.fit_transform(documents)

    similarity_scores=cosine_similarity(tfidf_matrix[0:1],tfidf_matrix[1:]).flatten()

    scores=[round(score*100,2) for score in similarity_scores]

    return scores