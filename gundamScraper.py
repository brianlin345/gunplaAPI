import requests
from urllib.request import urlopen
import sqlite3
from bs4 import BeautifulSoup

wiki_root = 'https://gundam.fandom.com'
wiki_link = 'https://gundam.fandom.com/wiki/High_Grade_Universal_Century'
db_file = "gunplaData.db"
db_entries = []

conn = sqlite3.connect(db_file)
c = conn.cursor()
c.execute('''SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='gunpla' ''')
if c.fetchone()[0]==1:
	print('Table exists.')
else:
	c.execute('''CREATE TABLE gunpla (id integer, name text, series text, height real, manufacturer text, price real, release text)''')

def process_ms_info(ms_link):
	response = urlopen(ms_link)
	page = BeautifulSoup(response)
	if page.find("span", attrs = {"class": "smwtext"}) != None:
		height = page.find("span", attrs = {"class": "smwtext"}).get_text()
		height = float(height.split()[0])
	else:
		height = 0
	manufacturer = "N/A"
	data_sections = page.find_all("section", attrs = {"class": "pi-item"})
	if (len(data_sections) > 1):
		data_section = data_sections[1]
		manufacturer_section = data_section.find("div", attrs = {"class": "pi-data-value"})
		if manufacturer_section != None and manufacturer_section.find("a") != None:
			manufacturer = manufacturer_section.find("a").get_text().strip()
	return [height, manufacturer]

def process_kit_info(kit_info_list, index):
	info_list = [index]
	ms_info = [0, "N/A"]
	for i in range(1, 3):
		if kit_info_list[i].find("a") != None:
			curr_link = kit_info_list[i].find("a")
			info_list.append(curr_link.get("title"))
			if i == 1:
				ms_info = process_ms_info(wiki_root + curr_link.get("href"))
		else:
			info_list.append("")
	info_list.extend(ms_info)
	for i in range(3, 5):
		info_list.append(kit_info_list[i].get_text().strip())
	info_entry = tuple(info_list)
	print(info_entry)
	db_entries.append(info_entry)

def scrape_wiki(wiki_link):
	response = urlopen(wiki_link)
	page = BeautifulSoup(response)
	kit_tables = page.find_all("table", attrs = {"class": "wikitable sortable"})
	index = 0
	for kit_table in kit_tables:
		kit_rows = kit_table.find_all("tr")
		for kit_row in kit_rows:
			kit_links = kit_row.find_all("a")
			if (len(kit_links) > 0):
				kit_info = kit_row.find_all("td")
				process_kit_info(kit_info, index)
				index += 1

scrape_wiki(wiki_link)

c.executemany('''INSERT INTO gunpla VALUES (?,?,?,?,?,?,?)''', db_entries)
conn.commit()
conn.close()
