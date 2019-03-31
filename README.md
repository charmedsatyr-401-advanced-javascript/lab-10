# lab-10
Project: Book App v2


Supported routes:

### `GET`

* `http :8080/`

* `http :8080/searches/new`

* `http :8080/books/:id`

### `POST`

* `echo '{}' | http post :8080/books`

* `echo '{}' | http post :8080/searches`

### `PUT`

* `echo '{}' | http put :8080/:id`

### `DELETE`

* `http delete :8080/books/:id`
