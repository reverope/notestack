# Notestack
Notes and Study Material Serving Platform.
<a href="http://notestackforyou.herokuapp.com">Visit</a>
  
# Idea

The idea sparked when I and my freinds were in our first semester of the BTech. degree persuing from NIT Silchar in CSE.

We had our exams approaching but we were unable to find reliable sources for notes and study materials. Either we have to ring up 
our CRs or the "topper" of our branch/class. 

Thus minds of Shashwat Priyadarshy, Rahul Jain and Biley Roy respectively cooked up this idea of notes serving platform and started working on. Now it is known as "Notestack".
 
 # Usage
 
 ## *\*This Documentation is only for testing and developing purpose\**
 
 Note: Port Number : 3000
 
 ### Accessible routes to users

 N.B. The restricted routes and semester routes can only be accessed by an authenticated user
 
|Routes Description        |  Routelinks                                   |
|--------------------------|-----------------------------------------------|
|HomePage Route            |  ``localhost:3000/home  or  localhost:3000/`` |
|AboutPage Route           |  ``localhost:3000/about``                     |
|IdeaPage Route            |  ``localhost:3000/idea``                      |
|MeetTheTeamPage Route     |  ``localhost:3000/meettheteam``               |
|UnderDevelopmentPage Route|  ``localhost:3000/udp``                       |
|ErrorPage                 |  ``localhost:3000/error``                     |
|**SemesterPages Route**   |  ``localhost:3000/sem/(semesternumber)``      |
|Examples                  |  ``localhost:3000/sem/1``                     |


 ### Restricted routes
  
| Routes Description                   |  Routelinks                                             |
|--------------------------------------|---------------------------------------------------------|
| Accessing all notes in semester x    | ``localhost:3000/sem/:x/:id/:username/showAllDocs``     |
| Adding notes to semester x           | ``localhost:3000/new/:id/:username/sem/:x``             |


# Team

| Contributor            | Role                |
|------------------------|---------------------|
| Shashwat Priyadarshy   | UX and UI Developer |
| Biley Roy              | Backend Developer   |
| Rahul Jain             | Content Developer   |
                      
# Dependencies
Body Parser <br>
EJS<br>
Express<br>
Jquery<br>
Method-Override<br>
Mongoose<br>
passport<br>
passport-local<br>
passport-local-mongoose<br>
express-session<br>

### Basic Dependencies
HTML |  CSS | Javascript  | NODE.JS  |  MONGODB
