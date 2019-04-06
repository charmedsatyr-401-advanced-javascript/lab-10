'use strict';

const rootDir = process.cwd();
const { word } = require('faker').random;

const books = require(`${rootDir}/src/models/mongo/books/books-model.js`);
const bookshelfSchema = require(`${rootDir}/src/models/mongo/bookshelf/bookshelf-schema.js`);

const supergoose = require('../supergoose.js');

beforeAll(supergoose.startDB);
afterAll(supergoose.stopDB);
/*
 * title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  image_url: { type: String, required: true },
  description: { type: String, required: true },
  bookshelf_id: { type: String, required: true },

 */

describe('`Books` model', () => {
  it('can post() a new book', () => {
    let obj = {
      title: word(),
      author: word(),
      isbn: word(),
      image_url: word(),
      description: word(),
      bookshelf: word(),
    };
    return books.post(obj).then(record => {
      const { _id } = record;
      return bookshelfSchema.find(_id).then(shelf => {
        const received = record.rows[0];
        // The next line requires `String` or it's a buffer.
        // Some async issue there.
        const bookshelf_id = String(shelf[0]._id);
        const expected = { ...obj, bookshelf_id };
        delete expected.bookshelf;
        expect(received).toMatchObject(expected);
      });
    });
  });

  it('can get() a book', async () => {
    // TODO: Should test bookshelf_id in a different test
    // TODO: should test find all books in a different test
    const obj = {
      title: word(),
      author: word(),
      isbn: word(),
      image_url: word(),
      description: word(),
      bookshelf: word(),
    };

    const post = await books.post(obj);
    const { _id } = post.rows[0];
    const book = await books.get(_id);
    const received = book[0].rows[0];
    const expected = { ...obj };
    delete expected.bookshelf;
    expect(received).toMatchObject(expected);
  });
  it('can put() a book modification', async () => {
    // TODO: Confirm bookshelf_id is the same before and after
    const obj = {
      title: word(),
      author: word(),
      isbn: word(),
      image_url: word(),
      description: word(),
      bookshelf: word(),
    };
    const update = {
      title: word(),
      author: word(),
      isbn: word(),
      image_url: word(),
      description: word(),
      bookshelf: word(),
    };
    const post = await books.post(obj);
    const { _id } = post.rows[0];
    const newBook = await books.put(update, _id);
    const received = newBook.rows[0];
    const expected = { ...update };
    delete expected.bookshelf;
    expect(received).toMatchObject(expected);
  });
  it('can delete() a book ', async () => {
    // TODO: Should `get` to confirm the book is no longer there
    const obj = {
      title: word(),
      author: word(),
      isbn: word(),
      image_url: word(),
      description: word(),
      bookshelf: word(),
    };
    const post = await books.post(obj);
    const { _id } = post.rows[0];
    const del = await books.delete(_id);
    delete obj.bookshelf;
    expect(del.rows[0]).toMatchObject(obj);
  });
});
