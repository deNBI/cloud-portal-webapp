#Starting the Webapp (on Ubuntu)

1. Colone this repo and switch to branch 'feature/react-setup
~~~BASH
git clone https://github.com/deNBI/cloud-portal-webapp.git
git checkout feature/react-setup
~~~

2. Install nodeJS (v6.x.x) and npm 
~~~BASH
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
~~~

3. Create a symling from 'nodejs' to 'node'
~~~BASH
sudo ln -s /usr/bin/nodejs /usr/bin/node
~~~

4. Uptade npm
~~~BASH
sudo npm install npm@latest -g
~~~

5. Go into repository and install dependencies
~~~BASH
cd cloud-portal-webapp
npm install
~~~

6. Start the npm server
~~~BASH
npm start
~~~
