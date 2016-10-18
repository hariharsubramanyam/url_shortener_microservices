# Description
This is a URL shortener app that demonstrates microservices.

Basically, we have two microservices. The first is the URL shortener, which is
responsible for creating and expanding mappings from a short name to a URL.

The second is an analytics microservice that keeps a log of requests, each 
associated with a key. A request consists of a browser, IP, and date.

The URL shortener microservice uses the analytics microservice to log requests
to shorten URLs and to display an analytics page that shows how many times
short name was expanded, on what days of the week, and with what browsers.

Although breaking the app into a URL shortening microservice and an analytics 
microservice is good for separation of concerns, if we wanted to go one step 
further and break the URL shortening microserving into two microservies. The
first would be responsible for creating and expanding mappings from short names
to URLs while the second would be responsible for serving the HTML pages. I did
not do this because it would add more code without adding much more learning value.

# Usage
First, make sure you start the MongoDB server `mongod` in one terminal.

Open another terminal window and go to the `url_shortener_microservice/` directory 
and install dependencies with `npm install`. Then run `node app.js` to start 
the URL shortener microservice.

Open yet another terminal window and go to the `analytics_microservice/` directory
and install dependencies with `npm install`. Then run `node.app.js` to start the
analytics microservice.

Now, navigate your browser to [http://localhost:3000](http://localhost:3000) to
use the URL shortener app. The analytics service is running on localhost:3001.
