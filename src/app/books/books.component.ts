import { Component, Inject, OnInit } from '@angular/core';
import { BookService } from '../services/books/bookservice.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit {

  public bookList: any;
  constructor(
    private bookService: BookService,
    @Inject(MAT_DIALOG_DATA) public data: {connectedUser: any},
    private dialogRef: MatDialogRef<BooksComponent>
  ) { 
    this.bookList = [];
  }

  ngOnInit(): void {
    this.bookService.getAll().subscribe(books => {
      this.bookList = books;
    })
  }

  borrowBook(book: any): void {
    this.bookService.borrowBook(book, this.data.connectedUser.id).subscribe(response => {
      this.dialogRef.close({result: "borrow_task_queued", book})
    });
  }
}
