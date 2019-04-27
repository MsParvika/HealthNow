from nltk.corpus import wordnet as wn
import requests
import nltk
import traceback

import json


import urllib

symptomList = [line.rstrip('\n') for line in open("symptoms.txt")]
wikipediaList = []
queryList = []
jsonDict = {}
urlList = []
for symptom in symptomList:
    description = ""
    if (symptom.strip() == "scleral"):
        sym = urllib.parse.urlencode({"titles":"Scleral_lens"})
    elif(symptom == "thicken"):
        sym = urllib.parse.urlencode({"titles": "Obesity"})
    else:
        sym = urllib.parse.urlencode({"titles":symptom})
    url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&"+sym
    r = requests.get(url)
    wiki_json = r.json()
    #print(wiki_json)
    try:


        content = wiki_json['query']['pages'][list(wiki_json['query']['pages'].keys())[0]]['extract']
        #content = content.replace("\n"," ")
        contentList = nltk.sent_tokenize(content)[:2]



        #contentList = content.split(" ")[:2]
        for i in contentList:
            content = contentList[0] + ". " + i

        url = "https://en.wikipedia.org/?curid="+list(wiki_json['query']['pages'].keys())[0]

        wikipediaList.append(content)
        urlList.append(url)
        jsonDict[symptom.capitalize()] = {"content":content, "url":url}
    except:
        traceback.print_exc()
        print(symptom)
    symSynset = []
    symSynset.append(symptom)

    syn = wn.synsets(symptom)
    fun = lambda x: str(x.lemmas()[0].name()).lower()

    #def fun2(synList):


    synsetNames = [fun(i) for i in syn]

    symSynset = symSynset + synsetNames
    symSynset = list(set(symSynset))
    queryVec = ""
    for i in symSynset:
        queryVec = queryVec + " " + i
    queryList.append(queryVec)


import json
with open('data3.json', 'w') as outfile:
	json.dump(jsonDict, outfile, sort_keys=True)
