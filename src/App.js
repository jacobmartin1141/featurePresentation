import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

import AppWorkspace from './AppWorkspace';
import Header from './Header';
import About from './About';
import Article from './Article';
import Updates from './Updates';
import Footer from './Footer';

const updates = [
  {
    title: "Alpha 0.3 Now Available!",
    text: ["Test Updat body text lorem ipsum ect",
      "Test Updat body text lorem ipsum ect"],
    src: "http://cdn.akc.org/content/article-body-image/samoyed_puppy_dog_pictures.jpg",
    alt: "",
  }, {
    title: "Alpha 0.1 Now Available!",
    text: ["Test Updat body text lorem ipsum ect Test Update body text lorem ipsum ect Test Update body text lorem ipsum ect Test Update body text lorem ipsum ect Test Update body text lorem ipsum ect Test Update body text lorem ipsum ect"],
    src: "https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1.00xw:0.669xh;0,0.190xh&resize=1200:*",
    alt: "",
  }, {
    title: "Upcoming features!",
    text: ["Test Updat body text lorem ipsum ect Test Update body text lorem ipsum ect Test Update body text lorem ipsum ect Test Update body text lorem ipsum ect Test Update body text lorem ipsum ect Test Update body text lorem ipsum ect"],
    src: "https://i.guim.co.uk/img/media/684c9d087dab923db1ce4057903f03293b07deac/205_132_1915_1150/master/1915.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=14a95b5026c1567b823629ba35c40aa0",
    alt: "",
  }, 
];

function App() {
  return (<Router>
      <Switch>
        <Route exact path="/app">
          <AppWorkspace />
        </Route>

        <Route exact path="">
          <section class="container-fluid page">
            <Header />

            <Router>
              <Switch>
                <Route exact path="/updates/:updateId">
                  <Article updates={updates}/>

                </Route>
                <Route exact path="/updates">
                  <Updates updates={updates}/>

                </Route>
                <Route exact path="/">
                  <About updates={updates}/>
                </Route>

              </Switch>
            </Router>

          </section>
          <Footer />
        </Route>
      </Switch>
    </Router>);
}

export default App;
