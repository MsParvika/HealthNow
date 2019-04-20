from bs4 import BeautifulSoup


with open('Disease.html', encoding="ISO-8859-1") as fp:
	soup = BeautifulSoup(fp,'html.parser')

diseaseList = []
countList = []
symptomList = []

cols = soup.findAll('td')

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