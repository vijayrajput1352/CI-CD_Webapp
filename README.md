# The Plant.Works Web Application Server
The Plant.Works Web Application Server - the browser front-end for the Plant.Works platform.

## **Setting up the Plant.Works WebApp Server development environment**
This section of the document described how to setup the webapp server codebase development environment, with the assumption that the development machine is Ubuntu 18.04 LTS or later. For non Debian-based Linux distros, or OS X / Windows machines, please refer to the appropriate manuals directly.

### **Pre-requisites**
The pre-requisites for runing the webapp server codebase are:

1. git version control system
2. build-essential (GCC toolchain)
3. PostgreSQL RDBMS V9.6+
4. Redis Server V5.0+
5. Elassandra
6. node.js V12.0+

### **Installing Git and build-essential**
On Debian-based Linux distros, simply type in the following command:

```
sudo apt install git build-essential
```


### **Installing PostgreSQL**
On Debian-based Linux distros, follow these instructions:

**Add the PostgreSQL APT Repository**

```
sudo apt install wget ca-certificates
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
```

**Install the PostgreSQL server, client, and toolset**

```
sudo apt update
sudo apt install postgresql postgresql-contrib libpq-dev pgadmin3
```

**Test if the installation went through fine**
1. Login into the Server and set a password for the *postgres* user

```
$ sudo -u postgres psql

postgres=# \password

postgres=# \q
```

**Modify the configuration to allow logins from roles in the terminal**
1. Edit the pg_hba.conf file to use md5 instead of "peer" for authentication

```
$ sudo nano /etc/postgresql/[postgress version installed]/main/pg_hba.conf
for e.g
$ sudo nano /etc/postgresql/11/main/pg_hba.conf
```

Find this line in the file:

```
# "local" is for Unix domain socket connections only
local	all		all		peer
```

And change it to:

```
# "local" is for Unix domain socket connections only
local	all		all		md5
```

Save and Exit.

2. Restart the PostgreSQL Server

```
$ sudo systemctl restart postgresql
```

**Launch *pgAdmin3* and connect to the PostgreSQL server installed on your localhost. Then execute the following steps:**

1. Create a database called **plantworks**

2. Create a *Login Role* called **plantworks** with password as **plantworks** and *superuser* privileges

3. Close pgAdmin3


**From the *Terminal*, test if the configuration is correct:**

Login into the PostgreSQL Server using the newly created user and password:

```
psql -U plantworks -W -d plantworks
```

If you see the standard psql prompt, the configuration has been succesful:

```
psql (11.5)
Type "help" for help.

plantworks=#
```


### **Installing Redis Server**
On Debian-based Linux distros, follow these instructions:

**From the *Terminal*, execute the following steps to install Redis server:**

1. Add the Redis server APT Repository

```
$ sudo apt-add-repository ppa:chris-lea/redis-server
```

2. Install the Redis server and client utilities

```
$ sudo apt update
$ sudo apt install redis-server
```

**Test if the installation went through fine:**

Type in the following command in the *Terminal*:

```
$ redis-cli ping
```

If the Redis server was installed succesfully, you should see the following response:

```
PONG
```

**Setting up Redis Server:**

We need to make sure that Background saving doesn't fail with a fork() error, so type in the following command in the _Terminal_:

```
$ echo 'vm.overcommit_memory = 1' >> /etc/sysctl.conf
$ sysctl vm.overcommit_memory=1
```

You can read more about this here: https://redis.io/topics/faq (search for 'overcommit')

By default keyspace event notifications are disabled. Notifications are enabled using the notify-keyspace-events of redis.conf or via the CONFIG SET.

redis.conf file can be found in `/etc/redis/redis.conf`

Look for `notify-keyspace-events` and set it to `KEA` as shown below:

```
notify-keyspace-events "KEA"
```

You can read more about this here: https://redis.io/topics/notifications

Restart the Redis Server

### **Installing Elassandra**
First uninstall Cassandra if it is already present in your system. Follow the instructions at :-  [Uninstall Cassandra](https://stackoverflow.com/questions/13390775/how-can-i-reinstall-a-cassandra-on-ubuntu)

Next install Elassandra - [Install Elassandra](https://elassandra.readthedocs.io/en/latest/installation.html)

### **Installing node.js & npm**
On Debian-based Linux distros, follow these instructions:

**From the *Terminal*, execute the following steps to install the latest version of node.js and npm:**

1. Create a new sources.list file

```
$ sudo nano /etc/apt/sources.list.d/nodesource.list
```

2. Type in the following lines into the file:

```
deb https://deb.nodesource.com/node_12.x bionic main
deb-src https://deb.nodesource.com/node_12.x bionic main
```

3. Install node.js

```
$ sudo apt update
$ sudo apt install nodejs
```

**Test if the installation went through fine:**

Type in the following command in the *Terminal*:

```
$ node -v
```

If node.js was installed succesfully, you should see the following response:

```
v12.2.0 (or whatever the current version is)
```

**Installing the mandatory NPM modules**

The Web Application Server codebase requires the availability of the following NPM modules at a global level:

```
$ sudo npm i -g eslint jsdoc eslint-plugin-jsdoc knex npm-check-updates pm2
```

If all of the above steps have been executed successfully, the Ubuntu machine is ready for developing on the Plant.Works Web Application Server...

## **Getting the IDE**
The "official" IDE for using a particular IDE within the Engineering Team is: [VScode](https://code.visualstudio.com/)

Depending on personal preference, the following may also be used:
1. [Atom](https://atom.io/)
2. [Emacs](https://www.gnu.org/software/emacs/)

Whichever IDE / Code Editor you choose, do ensure that the following *mandatory* plugins are available and installed:
1. [Editor Config](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
2. [JSBeautify](https://marketplace.visualstudio.com/items?itemName=HookyQR.beautify)
3. [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

For VSCode, it is recommended that you install the following additional extensions:
1. [Complete JSDoc Tags](https://marketplace.visualstudio.com/items?itemName=HookyQR.JSDocTagComplete)
2. [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
3. [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=hbenl.vscode-firefox-debug)
4. [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
5. [LiveShare](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-pack)

For VSCode, the following extensions are marked "nice-to-have", and may be installed depending on personal preferences:
1. [Cassandra Workbench](https://marketplace.visualstudio.com/items?itemName=kdcro101.vscode-cassandra)
2. [PostgreSQL](https://marketplace.visualstudio.com/items?itemName=ms-ossdata.vscode-postgresql)
3. [Redis Console](https://marketplace.visualstudio.com/items?itemName=kdcro101.vscode-redis)
4. [Material Theme](https://marketplace.visualstudio.com/items?itemName=Equinusocio.vsc-material-theme)
5. [Material Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-icon-theme)

It is also recommended that you install / use the Fira Code font for development. Instructions on installing the font can be
found at: [Linux Instructions](https://github.com/tonsky/FiraCode/wiki/Linux-instructions#installing-with-a-package-manager)

Instructions on integrating this font into VS Code can be found here: [VS Code Instructions](https://github.com/tonsky/FiraCode/wiki/VS-Code-Instructions)


## **Starting with the codebase**
This section of the document described how to start working with the codebase, running the server, running the test suite, generating documentation, profiling for performance, etc.

### **Installing the required NPM modules**
Before you can run the Server for the first time, you will need to install the dependencies required for the codebase. To do this, execute the following steps in the *Terminal*:

```
$ cd ~/source/webapp-server
$ npm install
```


### **Setting up the database schema**
Once the required npm modules have been installed, you will need to setup the basic database schema, and seed it with some data. This assumes that you have installed the PostgreSQL Server, created a plantowrks database, etc. as detailed earlier. Once those steps have been executed correctly, execute the following steps in the *Terminal*:

```
$ cd ~/source/webapp-server/knex_migrations
$ knex migrate:latest
$ knex seed:run
```


### **Setting up the keyspace**
The next step in the setup is to create a Cassandra *keyspace* for this server. This assumes that you have installed Apache Cassandra as detailed earlier. Once those steps have been executed correctly, execute the following steps in the *Terminal*:

```
$ cd ~/source/webapp-server/cql
$ cqlsh -f ./plantworks-keyspace.cql
```


### **Copying the configuration**
By default, the codebase ships only with the configurations required for running the server in *test* mode. To run it on your development setup,
copy the **/config/test** folder to **/config/development**, and change the settings as necessary.

Note that, if you've used the defaults specified in this document (Postgres, Redis, and Cassandra), you will not need to change anything - the default
configurations should work as-is. If, however, you have changed the defaults, then the same should be reflected in the appropriate */config/development/server/services/<service_name>_service.js* file.


## **Running the Web Application Server**
If ALL of the above steps have executed without errors, then the Web Application Server is ready to be run.

**Running the codebase**
To start the server execution, type the following in the *Terminal*:

```
$ cd ~/source/webapp-server
$ npm start
```

If the Server started successfully, you should see the following at the end of the start sequence:

```
PlantWorksWebAppServer started in: 21800.37ms
+----------+-----------+----------+---------------------------+------+
|  (index) | Interface | Protocol | Address                   | Port |
+----------+-----------+----------+---------------------------+------+
|     0    | lo        | IPv4     | 127.0.0.1                 | 9100 |
|     1    | lo        | IPv6     | ::1                       | 9100 |
|     2    | wlp1s0    | IPv4     | 192.179.4.130             | 9100 |
|     3    | wlp1s0    | IPv6     | fe80::5af4:ff3b:634d:4707 | 9100 |
+----------+-----------+----------+---------------------------+------+
```

To **shutdown** the Server instance gracefully, simply type **Ctrl+C** in the Terminal, and wait for a couple of seconds. IF the Server shutdown correctly, you should be taken back to the command prompt.


## **Executing the build process**
Running the tests bundled with the codebase, and generating documentation, is similar to runing the server itself. To run the test cases, type the following in the *Terminal*:

```
$ cd ~/source/webapp-server
$ npm run build
```

If the Tests were run succesfully, you should see something similar to the following at the end of the test sequence:

```
  Application Class Test Cases
    Instantiate
      ✓ PlantWorksWebApp should be an instanceOf PlantWorksBaseModule

  Configuration Service Test Cases
    Instantiate
      ✓ Should be an instanceOf PlantWorksBaseService
      ✓ Loader should be an instanceOf PlantWorksModuleLoader
    Lifecycle Hooks Test Cases
      ✓ Load test (471ms)
      ✓ Unload test


  5 passing (491ms)
```

If the documentation was generated successfully, you should be able to browse it by opening up the **index.html** in the **/docs** folder.
