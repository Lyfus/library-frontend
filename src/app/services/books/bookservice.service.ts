import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any>("http://127.0.0.1:3000/books");
  }

  getUserBooks(id: number) {
    return this.http.get<any>("http://127.0.0.1:3000/books/userBooks/" + id);
  }

  borrowBook(book:any, userId: number) {
    return this.http.put<any>("http://127.0.0.1:3000/books/borrow/" + userId, book)
  }

  giveBackBook(bookId: number) {
    return this.http.put<any>("http://127.0.0.1:3000/books/giveback/" + bookId, {})
  }
}
