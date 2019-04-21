import json
import fileinput

# Run this code only once. It will remove unneeded '\' (kal explain kar duga meeting main)
filename = 'webmd-answer.json'
f=fileinput.FileInput(filename, inplace=True, backup='.bak')
for line in f:
    print(line.replace("\\'", "'"))

f.close()