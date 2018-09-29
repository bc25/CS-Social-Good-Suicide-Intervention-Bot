# CS+Social Good - Suicide Intervention in LGBTQ+ Social Media Platforms 

## Overview
This repo houses supporting code for a bot which parses online web forumns for signs of suicidal or abusive behavior in order to flag posts and pipe information about flagged posts to a user-facing web platform, where clients may use the information to initiate interventional action with the authors of the flagged posts.

## Requirements for Python Imports
- [Requests](http://docs.python-requests.org/en/latest/)
- [BeautifulSoup](https://www.crummy.com/software/BeautifulSoup/)

## Command to Run Bot
Note: Code is for viewing only, as playground url is now deprecated and actual website user information is private.

```python trevorbot.py```

Optional argument: ```flagged_words.txt``` adds phrases from file (where each line is a phrase) to keyword database.
