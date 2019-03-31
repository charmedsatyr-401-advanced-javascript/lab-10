'use strict';

const bookshelfSchema = require('./bookshelf/bookshelf-schema.js');

class MongoModel {
  constructor(schema) {
    this.schema = schema;
  }

  get(id) {
    // Reformats the mongo result to a promise that resolves
    // to an object with the structure a SQL result
    // because that's what the views expect.
    if (id) {
      // getBook returns book data at [0], and shelf data at [1]
      const bookData = this.schema.findById(id).then(book => {
        const data = { rows: [book], rowCount: [book].length };
        return new Promise(resolve => resolve(data));
      });
      // get all the bookshelves
      const shelfData = bookshelfSchema.find().then(shelves => {
        const data = { rows: shelves, rowCount: shelves.length };
        return new Promise(resolve => resolve(data));
      });
      return Promise.all([bookData, shelfData]);
    } else {
      // getBooks just returns book data
      return this.schema.find().then(result => {
        const data = { rows: result, rowCount: result.length };
        return new Promise(resolve => resolve([data]));
      });
    }
  }

  async post(body) {
    // create a bookshelf and return the id of the bookshelf
    // use the id of the bookshelf as the bookshelf_id for the record
    //
    // take the body stuff to make a new book
    const { title, author, isbn, image_url, description, bookshelf } = body;
    const normalizedBookshelf = bookshelf.toLowerCase();
    let bookshelf_id = await bookshelfSchema.findOne({ name: normalizedBookshelf });

    if (!bookshelf_id) {
      const newBookshelf = new bookshelfSchema({ name: normalizedBookshelf });
      return newBookshelf.save().then(result => {
        const bookshelf_id = result.id;
        const record = { title, author, isbn, image_url, description, bookshelf_id };
        const newBook = new this.schema(record);
        return newBook.save().then(book => {
          const data = { rows: [book], rowCount: [book].length };
          return new Promise(resolve => resolve(data));
        });
      });
    } else {
      const record = { title, author, isbn, image_url, description, bookshelf_id: bookshelf_id.id };
      const newBook = new this.schema(record);
      return newBook.save().then(book => {
        const data = { rows: [book], rowCount: [book].length };
        return new Promise(resolve => resolve(data));
      });
    }
  }

  put(body, id) {
    const { title, author, isbn, image_url, description, bookshelf_id } = body;
    return this.schema
      .findByIdAndUpdate(id, { title, author, isbn, image_url, description, bookshelf_id })
      .then(book => {
        const data = { rows: [book], rowCount: [book].length };
        return new Promise(resolve => resolve(data));
      });
  }

  delete(id) {
    return this.schema.findByIdAndDelete(id).then(book => {
      const data = { rows: [book], rowCount: [book].length };
      return new Promise(resolve => resolve(data));
    });
  }
}

module.exports = MongoModel;
