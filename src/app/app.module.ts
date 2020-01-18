import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '../environments/environment';
import { AddTransactionComponent } from './add-transaction/add-transaction.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { TransactionsListComponent } from './transactions-list/transactions-list.component';

@NgModule({
  declarations: [AppComponent, TransactionsListComponent, LoginComponent, AddTransactionComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
    MatFormFieldModule,
    MatCheckboxModule
  ],
  providers: [AngularFirestore],
  bootstrap: [AppComponent],
  entryComponents: [AddTransactionComponent]
})
export class AppModule {}
