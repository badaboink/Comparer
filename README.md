# Comparer | T120B165 Saityno taikomųjų programų projektavimas
Website for ranking songs and saving the output to playlists.

Done:
* basic backend api of categories that have a lot of playlists with songs;
* hierarchal cruds;
* OAuth2;

Currently working on:
* Login;
* Normal user should be able to: delete their account, edit their account, update their playlists, update their songs, delete their playlists, delete their songs;
* Admin user should be able to: delete anyone's account (?), edit any users accounts, delete or edit any object belonging to anyone.


TO-DO (ideas for functions):
Must haves:
* front design;
* comparing songs function (compare playlist, compare artist discography, album etc.);
* saving comparisons as a playlist;
* sharing the playlist to friends;
* social media aspect of the site (following others, having a profile, page to see everyone's posts);
* compare other people's rating profiles with yours;
* match people with you based on rating likeness -> messaging.


Should haves:
* discover something new - get a recommendation to rate something new either from friends or site;
* gamify - get points for rating things and diversifying you taste and enter a leaderboard for most ratings;
* diversity of profile, how interesting is your music taste based on popularity, genre, etc.;
* private or public playlists.

Could haves:
* some extra design for after rating that shows the output, or general profile conclusion that creates a short design to showcase the main ratings or interests of user;
* playlist ranking with friends, editing rankings etc.


To start project locally:
Backend
* pip install -r requirements.txt
* activate.bat
* python manage.py migrate
* python manage.py createsuperuser 
* python manage.py runserver
* add to auth_user_groups that 1 user is of 1 group