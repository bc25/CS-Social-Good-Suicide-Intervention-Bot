import sys
import pymongo
import requests
from requests.auth import HTTPBasicAuth
from bs4 import BeautifulSoup
from datetime import datetime, date

key = '4525905149339ba1ae6f5f19d970a684'
url = 'http://stanford.ipbhost.com/api/forums/posts'
uri = 'mongodb://trevor:cs50@ds249545.mlab.com:49545/heroku_5czv9s99'


# Adds new phrases from file in which each line is a phrase to database.
def extractPhrases(file_name, coll):
    with open(file_name, 'r') as f:
        for line in f.readlines():
            coll.insert_one({'keyword': line.strip().lower()})

# Returns flagged keywords in post.
def getKeywords(post, coll):
    flags = []
    post_cleaned = " ".join([word.lower() for word in post.split()])
    cursor = coll.find({})
    for doc in cursor:
        if doc['keyword'] in post_cleaned:
            flags.append(doc['keyword'])
    return flags

def main():
    # Initialize MongoDB.
    client = pymongo.MongoClient(uri)
    db = client.get_default_database()
    flagged_posts = db['flagged_posts']

    # Extract keywords from file (optional).
    if len(sys.argv) > 1:
        extractPhrases(sys.argv[1], db['keywords'])

    # Retrieve ID of last post processed.
    collection = db['last_seen_id']
    if collection.count() == 0:
        collection.insert_one({'last_seen_id': 0})
    cursor = collection.find({})
    last_seen_id = 0
    for doc in cursor:  # should be only one
        last_seen_id = doc['last_seen_id']

    # Whether ID of last post processed has been updated.
    is_id_updated = False

    # Whether we have processed all the new posts.
    is_last_id_reached = False

    # Make API call to get forum posts.
    payload = {'sortBy':'date', 'sortDir':'desc'}
    r = requests.get(url, auth=HTTPBasicAuth(key, None), params=payload)
    data = r.json()
    
    while True:
        if data['totalResults'] == 0: break
        
        for post in data['results']:

            # Update database with last_seen_id for first post we see.
            if not is_id_updated:
                collection.update({}, {'last_seen_id': post['id']})
                is_id_updated = True

            # Break if have already seen ID.    
            if post['id'] <= last_seen_id:
                is_last_id_reached = True
                break
            
            # Parse post.
            soup = BeautifulSoup(post['content'], 'html.parser')
            content = soup.get_text().strip()
            keywords = getKeywords(content, db['keywords'])
            if len(keywords) > 0:
                bday = post['author']['birthday']
                age = None
                if bday != None and len(bday) >= 8:
                    born = datetime.strptime(post['author']['birthday'], "%m/%d/%Y")
                    today = date.today()
                    age = today.year - born.year - ((today.month, today.day) < (born.month, born.day))
                flagged_post = {
                                "name": post['author']['name'],
                                "profile_url": post['author']['profileUrl'],
                                "age": age,
                                "post_url": post['url'],
                                "post_content": content,
                                "post_date": post['date'],
                                "keywords": keywords,
                                "status": "Pending",
                                "accept_date": None,
                                "moderator": None,
                                "complete_date": None
                               }
                flagged_posts.insert_one(flagged_post)

        # Break if no more new posts to process.        
        if is_last_id_reached or data['totalPages'] - data['page'] == 0: break
        
        # Make another API call if more than one page left (TODO: test).
        next_page = data['page'] + 1
        payload['page'] = next_page
        r = requests.get(url, auth=HTTPBasicAuth(key, None), params=payload)
        data = r.json()
        
    sys.stdout.flush()

if __name__ == "__main__":
	main()
