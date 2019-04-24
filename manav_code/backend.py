import json
import fileinput
import nltk
from nltk.corpus import stopwords
from bs4 import BeautifulSoup
import time
import io
import traceback


stopWords = set(stopwords.words('english'))
contents = []
ansdate = []
months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

with open('webmd-answer.json') as json_file:
    data = json.load(json_file, strict=False,)
    for row in data:
    	contents.append(row['answerContent'].lower())
    	ansdate.append(row['answerPostDate'])

# Scrape disease names with count, and symptoms to lists

with io.open('Disease.html', encoding="ISO-8859-1") as fp:
	soup = BeautifulSoup(fp,'html.parser')

diseaseList = []
countList = []
symptomList = []

cols = soup.findAll('td')

m = open('drugs.txt', 'r')
md = m.readlines()
for ii in range(len(md)):
	md[ii] = md[ii].strip()
m.close()
mdPresentinAns = set()
for mdd in md:
	mdPresentinAns.add(mdd)
mdList = list(mdPresentinAns)

drugnames = set()

m12 = open('drugsComTest_raw.tsv','r')
m2read = m12.readlines()
for m2 in m2read:
		t = m2.split('\t')
		if len(t) == 7:
			drugnames.add(t[1])
m12.close()
drugnames = list(drugnames)
mdList += drugnames

#print(mdList)
for ii in range(0,len(cols),3):
	t = cols[ii].find('span').contents
	c = cols[ii+1].find('span').contents
	s = cols[ii+2].find('span').contents
	if len(t)>1:
		t = t[0].replace('\n ','')
		t = t.split('^')
		t = t[0].split('_')
		diseaseList.append(t[-1])
		c = c[0].replace('\n ','')
		countList.append(c)
		s = s[0].replace('\n ','')
		s = s.split('^')
		s = s[0].split('_')
		symptomList.append(s[-1])
		continue
	s = s[0].replace('\n ','')
	s = s.split('^')
	s = s[0].split('_')
	symptomList.append(s[-1])
	diseaseList.append(diseaseList[-1])
	countList.append(countList[-1])

symptomList = list(set(symptomList))
# Obtain answer contents
splitContents = []
for cc in contents:
	temp = cc.split(' ')
	splitContents.append(temp)


sanitizedSplit = []

ii = 0


# Cleaning data
# Sanitized split contains tokenized words for each answer-content (2D list)

for ss in splitContents:
	tmp = []
	for si in ss:
		tt = ''.join(e for e in si if e.isalnum())
		tt = tt.lower()
		if tt!='' and tt not in stopWords:
			tmp.append(tt)
	sanitizedSplit.append(set(tmp))

cooccurance = []




'''
ids = list(range(len(contents)))
mDict = {}

for ii in ids:
	for dd in mdList:
		if dd.split(' ')[0] in contents[ii]:
			if dd in mDict:
				mDict[dd] += 1
			else:
				mDict[dd] = 1

symptxt = sorted(mDict.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)
print(symptxt)
'''





symptomList = [line.rstrip('\n') for line in open("symptoms.txt")]
print(symptomList)
# Selected Symptoms keep updating on selection

def sym(selectedSymptoms):
	# Finding the ids where these symptoms occur
	ids = list(range(len(contents)))
	itt = time.time()
	for ss in selectedSymptoms:
		dates = {}
		newids = []
		for ii in ids:
			if ss in sanitizedSplit[ii]:
				newids.append(ii)
				if len(ansdate[ii])==19:
					adate = ansdate[ii].split(' ')[0]
					adate = int(adate.split('-')[1])
					adate = months[adate-1]
					dates[adate] = dates.get(adate,0) + 1
		ids = newids
		if len(ids)==0:
			break

	# Finding co-occuring words only in ids where selected symptoms are present and later sorting in descending order
	wordDict = {}
	for ii in ids:
		for ss in sanitizedSplit[ii]:
			#print(ss)
			if ss in wordDict:
				wordDict[ss] += 1
			else:
				wordDict[ss] = 1

	#mx = max(wordDict, key=wordDict.get)

	sortedKeys = sorted(wordDict.items(), key = lambda kv:(kv[1],kv[0]), reverse=True)


	# Of these sorted keywords, discarding those that are not nouns (singular/plural, common/proper)
	# nounsOnly is final correlated keywords dict

	nounsOnly = []
	ii = 0
	while len(nounsOnly)<30+len(selectedSymptoms):
		tt = nltk.pos_tag([sortedKeys[ii][0]])[0]
		if tt[1] == 'NN' or tt[1] == 'NNS' or tt[1] == 'NNP' or tt[1] == 'NNPS':
			nounsOnly.append(tt[0])
		ii += 1

	#print('\nTop 30 related keywords: ',nounsOnly[len(selectedSymptoms):])

	# Storing all keywords in the documents with respective count in a dict

	words = []
	for ss in splitContents:
		for si in ss:
			words.append(si)

	wordunique = list(set(words))

	wordsanitized = {}

	for uws in wordunique:
		tt = ''.join(e for e in uws if e.isalnum())
		if tt in wordsanitized and tt not in stopWords:
			wordsanitized[tt] += 1
		else:
			wordsanitized[tt] = 1

	# WordFreq contains freq of all words in all documents, not using this anywhere though

	wordsanitized.pop('',None)
	wordFreq = sorted(wordsanitized.items(), key = lambda kv:(kv[1],kv[0]), reverse=True)

	# Identify diseases present in the answers associated to the selected symptoms

	dDict = {}

	for ii in ids:
		for dd in diseaseList:
			if dd in contents[ii]:
				if dd in dDict:
					dDict[dd] += 1
				else:
					dDict[dd] = 1

	# Sort diseases by occurance

	mostLikely = sorted(dDict.items(), key = lambda kv:(kv[1],kv[0]), reverse=True)
	dates = sorted(dates.items(),key = lambda kv:(kv[1],kv[0]), reverse=True)

	#print('\nMost likely diseases: ',mostLikely)
	#print('\nMonths of prevalance: ',dates)
	#print('\nTime elapsed: ',time.time() - itt)


	sDict = {}

	for ii in ids:
		for dd in symptomList:
			if dd in contents[ii]:
				if dd in sDict:
					sDict[dd] += 1
				else:
					sDict[dd] = 1

	topSym = sorted(sDict.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)



	mDict = {}

	for ii in ids:
		for dd in mdList:
			if dd.split(' ')[0] in contents[ii]:
				if dd in mDict:
					mDict[dd] += 1
				else:
					mDict[dd] = 1

	topMed = sorted(mDict.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)
	#print(topMed)
	return (nounsOnly[len(selectedSymptoms):], mostLikely, dates, topSym, topMed)



final = {}
i=0
sym22 = []


final2 = {}


if("" in symptomList):
	symptomList.remove(symptomList.index(""))

for sym1 in symptomList:
	try:
		p1, p2 , p3, p4, p5 = sym([sym1.strip().lower()])
		#print(p3)
		#k = len(final["data"])


		final[str(sym1)]={"keyword":sym1, "top10Keywords":p1[:10], "likelyDiseases":[], "monthsOfPrevalance":{}, "likelySymptoms":[], "likelyMedicines":[]}

		#print(len(p4)<10)


		for month,val in p3:
			final[str(sym1)]["monthsOfPrevalance"][month] = val
		

		for dis,val in p2:
			final[str(sym1)]["likelyDiseases"].append({"disease":dis,"value":val})


		i=0

		for dis, val in p4:
			if (str(dis) == str(sym1)):
				continue
			if(val>i):
				i=val
			final[str(sym1)]["likelySymptoms"].append({"symptom": dis, "value": val})

		for dis, val in p5:
			final[str(sym1)]["likelyMedicines"].append({"medicine": dis, "value": val})

		final2[str(sym1)] = {"nodes": [], "links": []}

		final2[str(sym1)]["nodes"].append({"id": str(sym1), "group": 1, "freq":i+1})

		for k,v in p4:
			if (k == "vertigo"):
				print("Hello")
			if (str(k) == str(sym1)):
				if(k=="vertigo"):
					print("Hello")
				continue
			final2[str(sym1)]["nodes"].append({"id": k, "group": 2, "freq":v})
			final2[str(sym1)]["links"].append({"source": k, "target": str(sym1), "value": 1})
		sym22.append(sym1)
	except:
		#traceback.print_exc()
		print(sym1)

print(len(data))
import json
with open('data.json', 'w') as outfile:
    json.dump(final, outfile,sort_keys=True)


def sympfile(sym22):
	ids = list(range(len(contents)))
	sDict = {}

	for ii in ids:
		for dd in sym22:
			if dd in contents[ii]:
				if dd in sDict:
					sDict[dd] += 1
				else:
					sDict[dd] = 1

	symptxt = sorted(sDict.items(), key=lambda kv: (kv[1], kv[0]), reverse=True)
	sympdict={"words":[]}
	for k,v in symptxt:
		sympdict["words"].append({"word":k,"freq":v})
	with open('symptoms.json', 'w') as outfile:
		json.dump(sympdict, outfile)


sympfile(sym22)

with open("symptoms_no_freq.txt","w") as symfile:
	for i in sym22:
		symfile.write(i+"\n")


print(len(data))
import json

with open('data2.json', 'w') as outfile:
	json.dump(final2, outfile, sort_keys=True)


