Browse, Read, Edit, Add, Delete

B   GET            /users             Login screen
R   GET            /users/:id         user’s home screen
R   GET            /users/:id/maps    a user's maps?
R   GET            /users/:id/pins    a user's pins?
E   POST OR PATCH  /users/:id         edit user
A   POST           /users             add new user
D   POST           /users/:id/delete  delete user

B   GET            /maps              home screen of public maps
R   GET            /maps/:id          view single map
E   POST or PATCH  /maps/:id          edit map
A   POST           /maps              add new map
D   DELETE         /maps/:id/delete   delete map

B   GET            /pins              redirect to home screen of public maps?
R   GET            /pins/:id          view single pin
E   POST or PATCH  /pins/:id          edit a pin
A   POST           /pins              add a pin
D   POST           /pins/:id/delete   delete a pin

B   GET            /favourites        redir to home screen of public maps
R   GET            /favourites/:id    a favourite? or the user's favourites?
E   POST or PATCH  /favourites/:id    edit a favourite
A   POST           /favourites        add a favourite
D   POST           /favourites/:id    delete a favourite
