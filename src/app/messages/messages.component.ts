import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResults } from '../_models/Pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'Unread';
  constructor(private userService: UserService, private authService: AuthService,
              private routes: ActivatedRoute, private alertify: AlertifyService) { }

  ngOnInit() {
    this.routes.data.subscribe(data => {
      this.messages = data.messages.results;
      this.pagination = data.messages.pagination;
    });
  }

  loadMessages() {
    this.userService
        .getMessages(this.authService.decodedToken.nameid,
        this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
        .subscribe(
        (res: PaginatedResults<Message[]>) => {
          this.messages = res.results;
          this.pagination =  res.pagination;
        }, error => {
          this.alertify.error(error);
        });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
