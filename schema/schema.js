const graphql = require("graphql");
const _ = require("lodash");

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
} = graphql;

//dummy data
var books = [
  { book_title: "The History of Tom Jones", price: "$20", book_id: "1", author_id: "1" },
  { book_title: "The Final Empire", price: "$25", book_id: "2", author_id: "2" },
  { book_title: "Pride and Prejudice ", price: "$75", book_id: "3", author_id: "3" },
  { book_title: "Gitanjali", price: "$65", book_id: "4", author_id: "4" },
  { book_title: "Hoimonti", price: "$30", book_id: "5", author_id: "4" },
  { book_title: "Agnibeena", price: "$35", book_id: "6", author_id: "5" },
  { book_title: "The Fire of Joy", price: "$35", book_id: "7", author_id: "6" },
  { book_title: "The Egalitarian ", price: "$35", book_id: "8", author_id: "5" },
  { book_title: "Romeo and Juliet", price: "$35", book_id: "9", author_id: "7" },
  { book_title: "Fantastic Beasts and Where to Find Them", price: "$35", book_id: "10", author_id: "8" },
];

var authors = [
  { author_name: "Henry Fielding", country: "England", author_id: "1" },
  { author_name: " Brandon Sanderson", country: "America", author_id: "2" },
  { author_name: "Jane Austen", country: "England", author_id: "3" },
  { author_name: "Rabindranath Tagore", country: "Bangladesh", author_id: "4" },
  { author_name: "Kazi Nazrul Islam", country: "Bangladesh", author_id: "5" },
  { author_name: "Clive James", country: "Australia", author_id: "6" },
  { author_name: "William Shakespeare", country: "England", author_id: "7" },
  { author_name: "J. K. Rowling", country: "England", author_id: "8" },
];

var publishedBooks = [
  { book_title: "The History of Tom Jones", publication_date:"12-09-2005", publication_id: "1", author_id: "1",book_id: "1" },
  { book_title: "The Final Empire", publication_date:"13-09-2006", publication_id: "2", author_id: "2",book_id: "2" },
  { book_title: "Pride and Prejudice ", publication_date:"14-09-2007", publication_id: "3", author_id: "3" ,book_id: "3"},
  { book_title: "Gitanjali", publication_date:"15-09-2008", publication_id: "4", author_id: "4",book_id: "4" },
  { book_title: "Hoimonti", publication_date:"16-09-2009", publication_id: "5", author_id: "4" ,book_id: "5"},
  { book_title: "Agnibeena", publication_date:"17-09-2010", publication_id: "6", author_id: "5",book_id: "6" },
  { book_title: "The Fire of Joy", publication_date:"18-09-2011", publication_id: "7", author_id: "6" ,book_id: "7"},
  { book_title: "The Egalitarian ", publication_date:"19-09-2012", publication_id: "8", author_id: "5" , book_id: "8"},
  { book_title: "Romeo and Juliet", publication_date:"20-09-2013", publication_id: "9", author_id: "7" ,book_id: "9"},
  { book_title: "Fantastic Beasts and Where to Find Them", publication_date:"21-09-2014", publication_id: "10", author_id: "8",book_id: "10" },
];

// Dummy data end

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    book_id: { type: GraphQLID },
    book_title: { type: GraphQLString },
    price: { type: GraphQLString },
    author: {
      type: AuthorType,
      resolve(parent, args) {
        return _.find(authors, { author_id: parent.author_id });
      },
    },
  }),
});

const AuthorType = new GraphQLObjectType({
  name: "Author",
  fields: () => ({
    author_id: { type: GraphQLID },
    author_name: { type: GraphQLString },
    country: { type: GraphQLString },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return _.filter(books, { author_id: parent.author_id });
      },
    },
  }),
});

const PublishedBookType = new GraphQLObjectType({
  name: "PublishedBook",
  fields: () => ({
    publication_id: { type: GraphQLID },
    author_id: { type: GraphQLID },
    book_id: { type: GraphQLID },
    publication_date: { type: GraphQLString },
    books: {
      type: new GraphQLList(PublishedBookType),
      resolve(parent, args) {
        return _.filter(books, { author_id: parent.author_id });
      },
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Book: {
      type: BookType,
      args: { book_id: {type: GraphQLID} },
      resolve(parent, args) {
        //code to get data from db

        return _.find(books, { book_id: args.book_id});
      },
    },
    Author: {
      type: AuthorType,
      args: { author_id: {type: GraphQLID} },
      resolve(parent, args) {
        return _.find(authors, { author_id: args.author_id });
      },
    },
    PublishedBook: {
      type: PublishedBookType,
      args: { publication_id: {type: GraphQLID} },
      resolve(parent, args) {
        return _.find(publishedBooks, { publication_id: args.publication_id });
      },
    },
    Books: {
        type: new GraphQLList(BookType),
        resolve(parent, args){
            return books
        }
    },
    Authors: {
        type: new GraphQLList(AuthorType),
        resolve(parent, args){
            return authors
        }
    },

  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
