import json
import fileinput

# Run this code only once. It will remove unneeded '\' (kal explain kar duga meeting main)
filename = 'webmd-answer.json'
with fileinput.FileInput(filename, inplace=True, backup='.bak') as file:
    for line in file:
        print(line.replace("\\'", "'"), end='')