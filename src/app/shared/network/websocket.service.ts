import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { CompatClient, IMessage, Stomp } from '@stomp/stompjs';
import { StompSubscription } from '@stomp/stompjs/src/stomp-subscription';
import { AllocationsService } from '../data/allocations.service';
import { Allocation } from 'src/app/api/models';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  connection: CompatClient | undefined = undefined;
  private subscription: StompSubscription | undefined;
  private discoverySubscirption: StompSubscription | undefined;

  private readonly url = location.hostname;
  private readonly port = '8080';

  constructor() {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private connect(callback: () => void): void {
    if (!this.connection?.connected) {
      this.connection = Stomp.client(`ws://${this.url}:${this.port}/ws`);
    }

    try {
      this.connection.connect({}, () => {
        callback();
      });
    } catch (error) {
      console.log(error);
    }
  }

  private sendTo(path: string, message?: string): void {
    if (this.connection?.connected) {
      this.connection.send(path, {}, message);
    }
  }

  send(courseIterationId: string, path: string, text?: string): void {
    this.connection.send(`/app/course-iteration/${courseIterationId}/${path}`, {}, text);
  }

  listen(
    courseIterationId: string,
    allocationsCallback: (allocations: Allocation[]) => void,
    discoveryCallback: (allocations: Allocation[]) => void
  ): void {
    this.connect(() => {
      this.discover(courseIterationId, discoveryCallback);
      this.subscription = this.connection?.subscribe(
        `/topic/course-iteration/${courseIterationId}/allocations`,
        message => allocationsCallback(JSON.parse(message.body))
      );
    });
  }

  discover(courseIterationId: string, discoveryCallback: (allocations: Allocation[]) => void): void {
    this.send(courseIterationId, '/discovery');
    this.discoverySubscirption = this.connection?.subscribe(
      `/topic/course-iteration/${courseIterationId}/discovery`,
      message => {
        discoveryCallback(JSON.parse(message.body));
        this.discoverySubscirption?.unsubscribe();
      }
    );
  }
}
