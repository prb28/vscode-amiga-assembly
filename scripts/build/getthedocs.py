import urllib2
import re

def htmldecode(html):
	l=html
	l=l.replace('&#034;','"')
	l=l.replace('&#038;','&')
	l=l.replace('&#039;',"'")
	l=l.replace('&#060;','<')
	l=l.replace('&#062;','>')
	return l

def create_md_from_link(url, name):
	global map_all_libs_URL_to_name
	print 'url='+url
	print 'name='+name
	page=urllib2.urlopen('http://amigadev.elowar.com/read/ADCD_2.1/Includes_and_Autodocs_2._guide/node'+url+'.html')
	html=page.read()
	
	# Filename to write
	filename = name+".md"

	# Open the file with writing permission
	myfile = open(filename, 'w')
	md = ''
	sublinks = []
	dooutput=False
	codebloc=False
	isFileWithSynopsis=False

	codebloclinks=''
	for l in html.split('\n'):
		if 'BODY=END' in l:
			dooutput=False

		if dooutput:
			#use re.findall to get all the links in this doc file
			sublinks.extend(re.findall('<a href=\".*?/node(.*?)[.]html(?:#line\d+)?\">.*?</a>', l))

			#remove all anchors(can't handle them, maybe a future version of this program can ...)
			l=re.sub("<a name=\"[^\"]*?\">","",l)

			#search for additional links in this line
			links_in_line = re.findall('<a href=\".*?/node(.*?)[.]html(?:#line\d+)?\">([^<]*?)</a>', l)
			for link_in_line in links_in_line:
				lurl_orig =link_in_line[0]
				lname=link_in_line[1]
				lname_without_brackets = lname.replace('(','').replace(')','')

				#if the link points to an lib entry then use its name as url
				if(mapLibentriesURLsToName.has_key(lurl_orig)):
					lurl=mapLibentriesURLsToName[lurl_orig]
				#if it is a link to an external lib	
				elif map_all_libs_URL_to_name.has_key(lurl_orig):
					for libname in map_libname_to_URLs:
						mapURL_to_Name=map_libname_to_URLs[libname]
						if(mapURL_to_Name.has_key(lurl_orig)):
							lurl="../"+libname+"/"+mapURL_to_Name[lurl_orig]
							break
				#if it is a link to an external lib (old syntax way check)
				elif re.match(".*?[.]library/.*", lname_without_brackets):
					lurl= re.sub("(.*?)[.]library/(.*)",r"../\1/\2",lname_without_brackets)
				#otherwise use the technical document id
				else:
					lurl="_"+lurl_orig
				
				print "linelink: " +lname +" "+lurl_orig+ " "+ lurl

				#transform html link into markup
				if codebloc:
					l=re.sub("<a[^>]*?>", "",l)
					l=re.sub("</a>","",l)
					codebloclinks += "["+lname+"]("+lurl+") "
				else:
					l=re.sub("<a[^>]*?>"+lname_without_brackets+"\(?\)?</a>", r"["+lname_without_brackets+"]("+lurl+")",l)

				
			#remove all anchors end tags(can't handle them for now ...)
			l=re.sub("</a>","",l)


			#put emphasis markup around section name
			l=re.sub("^(NAME|SYNOPSIS|FUNCTION|WARNING|INPUTS|RESULTS|SEE ALSO)$",r"**\1**\n",l)

			#if we are still in code block and a new section starts, than we are at the end 
			if codebloc and not re.match("^[*][*][^*]*[*][*]",l) is None:
				md += str('```\n')
				codebloc=False
				
				if len(codebloclinks)>0: 
					md += str('Links: '+codebloclinks+'\n\n')
					codebloclinks=''
			
			if codebloc:
				#if inside codebloc then we replace html entities
				l=htmldecode(l)
			else:
				#delete leading white spaces outside of codeblocks
				l=re.sub("^\s*","",l)

			# Write a line to the file
			md += str(l+'\n')

			#codeblock section starts
			if '**SYNOPSIS**' in l:
				md +=str('```c\n')
				codebloc=True
				isFileWithSynopsis=True


		if 'BODY=START' in l:
			dooutput=True
			

	if not isFileWithSynopsis:
		md = str('```c\n') + md

	# Close the file
	if codebloc or not isFileWithSynopsis:
		if not isFileWithSynopsis:
			md= htmldecode(md)
		md += str('```\n')
		codebloc=False
		if len(codebloclinks)>0: 
			#myfile.write(str('Links: '+codebloclinks+'\n'))
			md+=str('Links: '+codebloclinks+'\n')
			codebloclinks=''

	myfile.write(md)
	myfile.close()
	return sublinks



# MAIN

libs = { "exec": "node0322", 
		 "dos":"node0279", 
		 "graphics": "node040D", 
		 "intuition": "node01F8",
		 "diskfont": "node01F2" }
map_all_libs_URL_to_name = {}
map_libname_to_URLs = {}
map_libname_to_links = {}
for libname in libs:
	print "collect links of "+libname
	libnodecode=libs[libname]
	#connect to exec
	website = urllib2.urlopen('http://amigadev.elowar.com/read/ADCD_2.1/Includes_and_Autodocs_2._guide/'+libnodecode+'.html')

	#read html code
	html = website.read()

	#cut of the beginning, which contains browser navigation stuff. unneeded for us
	html = html[html.find("BODY=START"):]

	#use re.findall to get all the lib entry links
	current_links = re.findall('node(.*?)[.]html">(.*?)\(?\)?</a>', html)

	current_mapLibentriesURLsToName = {}
	for link in current_links:
		current_mapLibentriesURLsToName[link[0]] = link[1] 
		map_all_libs_URL_to_name[link[0]] = link[1]

	#remember all libentry nodecodes for this lib
	map_libname_to_URLs[libname]=current_mapLibentriesURLsToName 
	map_libname_to_links[libname] = current_links

#lib to generate
libname="intuition"

links=map_libname_to_links[libname]
mapLibentriesURLsToName=map_libname_to_URLs[libname]
allsublinks=[]
for link in links:
	#create md file and get all sublinks
	sublinks = create_md_from_link(link[0], link[1])
	#remove duplicates in sublinks
	sublinks = list(dict.fromkeys(sublinks))
	#remove sublinks already in main lib entries
	for link in links:
		if link[0] in sublinks:
			sublinks.remove(link[0])

	allsublinks.extend(sublinks)
	

#remove duplicates in allsublinks
allsublinks = list(dict.fromkeys(allsublinks))
for sublink in allsublinks:
	print "create 2nd level doc"
	#create md file and get all sublinks
	sublinks = create_md_from_link(sublink, "_"+sublink)

#should we make a third pass to collect docs in the third level?