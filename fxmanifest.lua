fx_version "cerulean"

author "S1nScripts, Project Error"
version '1.0.0'

lua54 'yes'

games {
  "gta5",
  "rdr3"
}

ui_page 'web/build/index.html'

client_script "client/**/*"
server_script "server/**/*"
shared_script "shared/**/*"

files {
	'web/build/index.html',
	'web/build/**/*',
}