import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BooksComponent } from '../books/books.component';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from '../services/users/users.service';
import { MatSidenav } from '@angular/material/sidenav';
import { BookService } from '../services/books/bookservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('sidenav')
  sidenav!: MatSidenav;
  
  loginForm = new FormGroup({
    login: new FormControl(''),
    password: new FormControl(''),
  });
  loginError = false;

  public actualDialog: any;
  public connectedUser: any;
  public userBooks: any;
  constructor(
    public dialog: MatDialog,
    public userService: UserService,
    public bookService: BookService
  ) { }

  ngOnInit(): void {
    this.actualDialog = "Bienvenue à la librairie, en quoi puis-je vous aider ?"
  }

  changeDialogMessage(mode?: string) {
    switch(mode) {
      case 'book_overview':
        this.actualDialog = "Très bien, vous venez consulter notre collection ?";
        break;
      default:
        this.actualDialog = "Bienvenue à la librairie, en quoi puis-je vous aider ?";
    }
  }
  openBooksDialog() {
      const dialogRef = this.dialog.open(BooksComponent, {
        data: { connectedUser: this.connectedUser },
        width: '80%',
        height: '80%',
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.result == "borrow_task_queued") {
          this.actualDialog = "Vous voulez `" + result.book.name + "` ? Je vais vérifier qu'il est bien disponible..";
          this.bookService.getUserBooks(this.connectedUser.id).subscribe((books: any) => {
            this.userBooks = books;
            this.actualDialog = "Le livre était disponible, voici votre livre !";
          })
        }
      });
  }

  loginSubmit() {
    this.userService.login(this.loginForm.value).subscribe(user => {
      if(user) {
        this.connectedUser = user;
        this.actualDialog = "Bienvenue " + this.connectedUser.firstName + " " + this.connectedUser.lastName + ", que pouvons-nous faire pour vous?"

        this.bookService.getUserBooks(this.connectedUser.id).subscribe((books: any) => {
          this.userBooks = books;
        });

        this.sidenav.close();
      }
      else {
        this.loginError = true;
      }
    });
  }

  giveBackBook(book: any) {
    this.bookService.giveBackBook(book.id).subscribe(bookState => {
      if(bookState == 'damaged') {
        this.actualDialog = "Oh non... Ce livre est abimé, nous allons devoir le réparer...";
      } else {
        this.actualDialog = "Merci d'avoir ramené ce livre !";
      }

      let bookIndex = this.userBooks.findIndex((ubook: any) => ubook.id == book.id)
      console.log("bookIndex", bookIndex);
      if(bookIndex != -1) {
        this.userBooks.splice(bookIndex, 1);
      }
      
    });
  }

  disconnect() {
    this.connectedUser = undefined;
    this.actualDialog = "Au plaisir de vous revoir !";
  }
}
