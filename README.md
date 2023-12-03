# Comparer | T120B165 Saityno taikomųjų programų projektavimas
Website for ranking songs and saving the output to playlists.

<h3>Done:</h3>
<ul>
<li>basic backend api of categories that have a lot of playlists with songs;</li>
<li>hierarchal cruds;</li>
<li><s>OAuth2</s> JWT token (will be changed back later);</li>
<li>Login, logout, sign-up, other permissions.</li>
</ul>

<h3>Currently working on:</h3>
<ul>
<li>basics of front design;</li>
</ul>

<h2>TO-DO</h2>
<h3>Must haves:</h3>
<ul>
  <li>comparing songs function (compare playlist, compare artist discography, album etc.);</li>
  <li>saving comparisons as a playlist;</li>
  <li>sharing the playlist to friends;</li>
  <li>social media aspect of the site (following others, having a profile, page to see everyone's posts);</li>
  <li>compare other people's rating profiles with yours;</li>
  <li>match people with you based on rating likeness -> messaging.</li>
</ul>
 
<h3>Should haves:</h3>
<ul>
  <li>discover something new - get a recommendation to rate something new either from friends or site;</li>
  <li>gamify - get points for rating things and diversifying you taste and enter a leaderboard for most ratings;</li>
  <li>diversity of profile, how interesting is your music taste based on popularity, genre, etc.;</li>
  <li>private or public playlists.</li>
</ul>

<h3>Could haves:</h3>
<ul>
  <li>some extra design for after rating that shows the output, or general profile conclusion that creates a short design to showcase the main ratings or interests of user;</li>
  <li>playlist ranking with friends, editing rankings etc.</li>
</ul>

<h2>To start project locally:</h2>
prerequisites - make a local database with the name comparer
<h3>Backend:</h3>

```
pip install -r requirements.txt
```

```
activate.bat
```

```
python manage.py migrate
```

```
python manage.py createsuperuser
```

```
python manage.py runserver
```

add to auth_user_groups that user whose id is 1 is of group 1 (to have one admin)

<h3>Frontend:</h3>
template from <a href="https://github.com/codedthemes/berry-free-react-admin-template" target="_blank">CodedThemes</a>

```
npm install
```

```
npm start
```