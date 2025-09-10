import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  generateNotes: boolean = true;
  viewNotes: boolean = false;
  noteLink: string = "";
  enteredText: string = "";
  enteredPassword: string = "";
  enteredDuration: string = "once";
  noteLinkCredential: string = "";
  passwordCredential: string = "";
  noteText: string = "";
  noteMsg: string = "";
  userNotes: any[] = [];
  viewModalOpen: boolean = false;
  deleteModalOpen: boolean = false;
  updateModalOpen: boolean = false;
  selectedNoteText: string = '';
  selectedNotePasswordStatus: string = "";
  updatedNoteText: string = "";
  noteToUpdate: string = "";
  noteToDelete: any = null;
  isNoteText : boolean = true;
  isStrongPassword : boolean = true;
  isNoteUrl : boolean = true;
  strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  // temp : string = "Copy";
  // Instead of single string
  copiedStates: { [noteUrl: string]: string } = {};


  ngOnInit() {
    this.fetchUserNotes();
  }

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) { }

  getGenerateNotes() {
    this.generateNotes = true;
    this.viewNotes = false;
  }

  getViewNotes() {
    this.generateNotes = false;
    this.viewNotes = true;
  }

  createNote() {
    if (!this.enteredText) {
      this.isNoteText = false;
      this.isStrongPassword = true;
      this.enteredPassword = "";
      return;
    }

    else if(this.enteredPassword) {
      if(!this.strongPasswordRegex.test(this.enteredPassword)) {
        this.isStrongPassword = false;
        this.isNoteText = true;
        this.enteredPassword = "";
        return;
      }
    }

    this.http.post<{ generatedLink: string }>("https://make-notes-qyc8.onrender.com/notes/create", {
      noteText: this.enteredText,
      notePassword: this.enteredPassword,
      noteDuration: this.enteredDuration
    })
      .subscribe({
        next: ({ generatedLink }) => {
          this.noteLink = generatedLink;
          this.enteredText = "";
          this.enteredPassword = "";
          this.isStrongPassword = true;
          this.enteredDuration = "once";
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            alert("Your token or session is expired!! Login again")
          }
          else {
            alert('Server error – check backend console.')
          }
        }
      });
  }

  getNote() {
    if (!this.noteLinkCredential)  {
      this.isNoteUrl = false;
      return;
    }

    this.http.post<{ text: string, msg: string }>("https://make-notes-qyc8.onrender.com/notes/get", {
      noteLinkCredential: this.noteLinkCredential,
      passwordCredential: this.passwordCredential
    })
      .subscribe({
        next: ({ text, msg }) => {
          this.noteText = text;
          this.noteMsg = msg;
          this.isNoteUrl = true;
          this.noteLinkCredential = "";
          this.passwordCredential = "";
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            alert("Your token or session is expired!! Login again")
          }
          else {
            alert('Server error – check backend console.')
          }
        }
      });
  }

  logout() {
    this.auth.logout();
  }

  fetchUserNotes() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) return;

    this.http.get<{ notes: any[] }>(
      "https://make-notes-qyc8.onrender.com/notes/myNotes",
    ).subscribe({
      next: (res) => this.userNotes = res.notes,
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
            alert("Your token or session is expired!! Login again")
          }
          else {
            alert('Server error – check backend console.')
          }
      }
    });
  }

  copyLink(noteUrl: string) {
    navigator.clipboard.writeText(noteUrl).then(() => {
      console.log("Your link is copied to the clipboard!!");
      this.copiedStates[noteUrl] = "Copied";   //  mark this button as Copied

      // Reset it back to "Copy" after 2 sec
      setTimeout(() => {
        this.copiedStates[noteUrl] = "Copy";
      }, 2000);
    }).catch(() => {
      alert("Failed to copy link");
    });
  }

  viewNote(noteUrl: string) {
    this.http.post<{ text?: string; isPassword?: string }>(
      "https://make-notes-qyc8.onrender.com/notes/view",
      { noteUrl }
    ).subscribe({
      next: ({ text, isPassword }) => {
        if (text && isPassword) {
          this.selectedNoteText = text;
          this.selectedNotePasswordStatus = isPassword;
          this.viewModalOpen = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          alert("Your token or session is expired!! Login again");
        } else {
          alert("Server error – check backend console.");
        }
      }
    });
  }

  updateNote(noteUrl : string) {
    this.noteToUpdate = noteUrl;

    this.http.post<{ text : string }>("https://make-notes-qyc8.onrender.com/notes/view", { noteUrl })
    .subscribe({
      next : ({ text }) => {
        this.updatedNoteText = text;
        this.updateModalOpen = true;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          alert("Your token or session is expired!! Login again");
        } else {
          alert("Server error – check backend console.");
        }
      }
    })
  }

  confirmUpdate() { 
  if (this.noteToUpdate && this.updatedNoteText.trim()) {
    this.http.post<{ success : boolean }>("https://make-notes-qyc8.onrender.com/notes/update", { noteUrl : this.noteToUpdate, updatedNoteText : this.updatedNoteText })
    .subscribe({
      next : ({ success }) => {
        if(success) {
          console.log("Your note is successfully updated!!");
          this.fetchUserNotes();
          this.closeModal();
        }
        else {
          alert("Update failed");
        }
      },
      error : (err : HttpErrorResponse) => {
         if (err.status === 401) {
          alert("Your token or session is expired!! Login again");
        } else {
          alert("Server error – check backend console.");
        }
      }
    })
    console.log('Updating:', this.noteToUpdate, 'with text:', this.updatedNoteText);
  }
  this.closeModal();
  }

  deleteNote(noteUrl: string) {
    this.noteToDelete = noteUrl;
    this.deleteModalOpen = true;
  }

  confirmDelete() {
    if (this.noteToDelete) {
      this.http.post<{ deleted: boolean }>(
        "https://make-notes-qyc8.onrender.com/notes/delete",
        { noteUrl: this.noteToDelete } // FIX: Send directly
      ).subscribe({
        next: (res) => {
          if (res.deleted) {
            console.log("Deleted the note successfully!!");
            this.fetchUserNotes(); // Refresh notes list
          } else {
            console.log("Note is not deleted, there is some issue in deleting the note");
          }
        },
        error: (err : HttpErrorResponse) => {
          if (err.status === 401) {
            alert("Your token or session is expired!! Login again");
          } else {
            alert("Server error – check backend console.");
          }
        }
      });
    }
    this.closeModal();
  }

  closeModal() {
    this.viewModalOpen = false;
    this.deleteModalOpen = false;
    this.updateModalOpen = false;
    this.selectedNoteText = '';
    this.noteToDelete = null;
    this.updatedNoteText = "";
  }
}
